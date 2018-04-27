var Globals = require('globals');

Object.defineProperty(Room.prototype, 'sources', {
    get: function() {
            // If we dont have the value stored locally
        if (!this._sources) {
                // If we dont have the value stored in memory
            if (!this.memory.sourceIds) {
                    // Find the sources and store their id's in memory, 
                    // NOT the full objects
                this.memory.sourceIds = this.find(FIND_SOURCES).map(source => source.id);
            }
            // Get the source objects from the id's in memory and store them locally
            this._sources = this.memory.sourceIds.map(id => Game.getObjectById(id));
        }
        // return the locally stored value
        return this._sources;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Room.prototype, 'mineral', {
    get: function() 
    {
        if (!this._mineral) 
        {
            if (!this.memory.mineralID) 
            {
                let results = this.find(FIND_MINERALS);
                if(results.length > 0)
                {
                    this.memory.mineralID = results[0].id;
                }
            }
        }
        
        this._mineral = Game.getObjectById(this.memory.mineralID);

        return this._mineral;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Room.prototype, 'containers', {
    get: function() {
        if (!this._containers) {
            this._containers = this.find(FIND_STRUCTURES, {filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER) }});
        }
        return this._containers;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Room.prototype, 'spawns', {
    get: function() {
        if (!this._spawns) {
            this._spawns = this.find(FIND_MY_STRUCTURES, {filter: (structure) => { return (structure.structureType == STRUCTURE_SPAWN) }});
        }
        return this._spawns;
    },
    enumerable: false,
    configurable: true
});

Room.prototype.spawnQueueCount =
    function (role)
    {
        let queuedCreepCount = _.countBy(this.memory.spawnQueue, (queuedCreep) => queuedCreep.role);
        return queuedCreepCount[role] || 0;
    }

Room.prototype.executeLinks =
    function ()
    {
        if(this.storage)
        {
            let storageLink = this.storage.link;
            
            if(this.storage.link)
            {        
                let linksWithEnergy = this.find(FIND_MY_STRUCTURES, {filter: (structure) => { 
                    return (structure.structureType == STRUCTURE_LINK) && (structure.energy > 0)}});            
                
                for(let link in linksWithEnergy)
                {
                    if(linksWithEnergy[link].id != this.storage.link.id)
                    {
                        linksWithEnergy[link].transferEnergy(this.storage.link);
                    }
                }
            }
        }
    };

    Room.prototype.executeDefenses =
    function ()
    {    
        let hostiles = this.find(FIND_HOSTILE_CREEPS);
        //TODO: Spawn creeps to defend.
        //If more than 10 hostiles are in the room we are in trouble, activate SafeMode!
        if(hostiles.length > 10)
        {
            this.controller.activateSafeMode();
        }
    };

    Room.prototype.spawnCreepsIfNecessary =
    function ()
    {

        if(this.creepCountByRole('builder') + this.spawnQueueCount('builder') < 1) 
        {
            let sites = this.find(FIND_CONSTRUCTION_SITES);
            if(sites.length > 0) 
            {
                this.addToSpawnQueue({role: 'builder', targetRoom: this.name});
            }
        }

        if(this.creepCountByRole('cleaner') + this.spawnQueueCount('cleaner') < 1)
        {
            this.addToSpawnQueue({role: 'cleaner'});
        }

        if(this.storage)
        {
            let maxNumberOfUpgraders = Math.min(Math.floor(this.storage.store[RESOURCE_ENERGY] / 75000), 4);

            if((this.creepCountByRole('upgrader') + this.spawnQueueCount('upgrader')) < maxNumberOfUpgraders)
            {
                this.addToSpawnQueue({role: 'upgrader'});
            }

            if(this.storage.link && (this.creepCountByRole('linkUnloader') + this.spawnQueueCount('linkUnloader')) < 1)
            {
                this.addToSpawnQueue({role: 'linkUnloader'}, true);
            }

            if((this.creepCountByRole('storageManager') + this.spawnQueueCount('storageManager')) < 1)
            {
                this.addToSpawnQueue({role: 'storageManager'}, true);
            }

            if(this.terminal && ((this.creepCountByRole('terminalHauler') + this.spawnQueueCount('terminalHauler')) < 1))
            {
                let spawnTerminalHauler = false;
                for(resourceType in this.storage) 
                {
                    resourceAmount = this.terminal.store[resourceType] || 0;
                    if(resourceAmount < 5000)
                    {
                        spawnTerminalHauler = true;
                    }
                }

                if(spawnTerminalHauler)
                {
                    this.addToSpawnQueue({role: 'terminalHauler'});
                }
            }
        }
        else
        {
            if((this.creepCountByRole('upgrader') + this.spawnQueueCount('upgrader')) < 2)
            {
                this.addToSpawnQueue({role: 'upgrader'});
            }
        }
    };

    Room.prototype.spawnResourceCreeps =
    function()
    {
        for(let sourceIndex in this.sources)
        {
            let source = this.sources[sourceIndex];

            if(source.link)
            {
                if(!source.harvester && this.spawnQueueCount('linkHarvester') < 1)
                {
                    this.addToSpawnQueue({role: 'linkHarvester', targetID: source.id, targetRoom: source.room.name}, true);
                }
            }
            else
            {
                if(!source.harvester && this.spawnQueueCount('containerHarvester') < 1)
                {
                    this.addToSpawnQueue({role: 'containerHarvester', targetID: source.id, targetRoom: source.room.name}, true);
                }

                if(source.container)
                {
                    if((source.container.transports.length + this.spawnQueueCount('containerTransport')) < 2)
                    {
                        this.addToSpawnQueue({role: 'containerTransport', targetID: source.container.id, homeRoom: this.name});
                    }
                }  
            }
        }

        if(this.mineral)
        {
            if(this.mineral.extractor && this.mineral.ticksToRegeneration == undefined)
            {
                if(!this.mineral.harvester && this.spawnQueueCount('mineralHarvester') < 1)
                {
                    this.addToSpawnQueue({role: 'mineralHarvester', targetID: this.mineral.id, targetRoom: this.mineral.room.name});
                }
            }
            if(this.mineral.container && this.mineral.container.hasResource)
            {
                if((this.mineral.container.transports.length + this.spawnQueueCount('containerTransport')) < 1)
                {
                    this.addToSpawnQueue({role: 'containerTransport', targetID: this.mineral.container.id, homeRoom: this.name});
                }
            }
        }
    };

    Room.prototype.addToSpawnQueue = 
    function (creepMemory, spawnNext = false)
    {
        this.memory.spawnQueue = this.memory.spawnQueue || [];

        if(spawnNext)
        {
            this.memory.spawnQueue.unshift(creepMemory);
        }
        else
        {
            this.memory.spawnQueue.push(creepMemory);
        }
    };

    Room.prototype.executeSpawns = 
    function ()
    {
        //Run spawn logic
        for (let name in this.spawns)
        {
            let spawn = this.spawns[name];
            
            console.log('RoomBasedSpawn:' + this.spawns[name].name + ' spawnQueue.length:' + this.memory.spawnQueue.length);
        
            spawn.spawnNextInQueue();
        }
    };

    Room.prototype.creepsByRole = 
    function(role, targetRoom = null)
    {
        let results;
        if(targetRoom)
        {
            results = _.filter(Game.creeps, (creep) => creep.memory.role == role && creep.room == this && creep.memory.targetRoom == targetRoom);  
        }
        else
        {
            results = _.filter(Game.creeps, (creep) => creep.memory.role == role && creep.room == this);
        }
        return results;
    };

    Room.prototype.creepCountByRole = 
    function(role, targetRoom = null)
    {
        let count;
        if(targetRoom)
        {
            count = _.filter(Game.creeps, (creep) => creep.memory.role == role && creep.room == this && creep.memory.targetRoom == targetRoom).length;  
        }
        else
        {
            count = _.filter(Game.creeps, (creep) => creep.memory.role == role && creep.room == this).length;
        }
        return count;
    };