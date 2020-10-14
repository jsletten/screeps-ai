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

Object.defineProperty(Room.prototype, 'labs', {
    get: function() {
        if (!this._labs) {
            this._labs = this.find(FIND_MY_STRUCTURES, {filter: (structure) => { return (structure.structureType == STRUCTURE_LAB) }});
        }
        return this._labs;
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
            if(this.storage.link)
            {        
                let linksWithEnergy = this.find(FIND_MY_STRUCTURES, {filter: (structure) => { 
                    return (structure.structureType == STRUCTURE_LINK) && (structure.energy > 0)}});            
                
                for(let link in linksWithEnergy)
                {
                    if(linksWithEnergy[link].id != this.storage.link.id && (!this.controller.link || this.controller.link.id != linksWithEnergy[link].id))
                    {
                        if(this.controller.link && this.controller.link.energy < 400)
                        {
                            linksWithEnergy[link].transferEnergy(this.controller.link)
                        }
                        else
                        {
                            linksWithEnergy[link].transferEnergy(this.storage.link);
                        }
                    }
                }

                if(this.controller.link)
                {
                    this.storage.link.transferEnergy(this.controller.link)
                }
            }
        }
    };


Room.prototype.executeTerminal =
    function()
    {
        if(this.terminal && !this.terminal.cooldown)
        {
            for (let roomName in Game.rooms)
            {
                let room = Game.rooms[roomName];
                
                if(room != this && room.controller && room.controller.my && room.terminal)
                {      
                    for(resourceType in this.terminal.store) 
                    {
                        if(this.terminal.store[resourceType] > 5000)
                        {
                            let remoteResourceAmount =  room.terminal.store[resourceType] || 0;
                            if(remoteResourceAmount < 5000)
                            {
                                this.terminal.send(resourceType, 5000 - remoteResourceAmount, roomName);
                            }
                        }
                    }  
                }
            }
        }
    };

Room.prototype.executeLabs =
    function()
    {
        for(let x = 0; x < this.labs.length; x++)
        {
            let targetLab = this.labs[x];
            if(targetLab.memory.createMineralType)
            {
                let lab1 = targetLab.pos.findInRange(FIND_MY_STRUCTURES, 2, {filter: (structure) => (structure.structureType == STRUCTURE_LAB && structure.mineralType == Globals.mineralDescriptions[targetLab.memory.createMineralType].component1)})[0];
                let lab2 = targetLab.pos.findInRange(FIND_MY_STRUCTURES, 2, {filter: (structure) => (structure.structureType == STRUCTURE_LAB && structure.mineralType == Globals.mineralDescriptions[targetLab.memory.createMineralType].component2)})[0];

                if(lab1 && lab2)
                {
                    targetLab.runReaction(lab1, lab2);
                }
            }
        }
    };

Room.prototype.executeDefenses =
    function ()
    {    
        let hostiles = this.find(FIND_HOSTILE_CREEPS);
        //TODO: Spawn creeps to defend.
        //If more than 4 hostiles are in the room we are in trouble, activate SafeMode!
        if(hostiles.length > 4)
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

        if(this.storage)
        {
            if(this.creepCountByRole('cleaner') + this.spawnQueueCount('cleaner') < 1)
            {
                this.addToSpawnQueue({role: 'cleaner'});
            }

            let maxNumberOfUpgraders = Math.min(Math.floor(this.storage.store[RESOURCE_ENERGY] / 75000), 4);

            if((this.creepCountByRole('upgrader') + this.spawnQueueCount('upgrader')) < maxNumberOfUpgraders)
            {
                this.addToSpawnQueue({role: 'upgrader'});
            }

            // if(this.controller && this.controller.container && !this.controller.link)
            // {
            //     if((this.creepCountByRole('upgraderTransport') + this.spawnQueueCount('upgraderTransport')) < maxNumberOfUpgraders)
            //     {
            //         this.addToSpawnQueue({role: 'upgraderTransport', targetID: this.controller.container.id, homeRoom: this.name});
            //     }
            // }

            if(this.storage.link && (this.creepCountByRole('linkUnloader') + this.spawnQueueCount('linkUnloader')) < 1)
            {
                this.addToSpawnQueue({role: 'linkUnloader'}, true);
            }

            if((this.creepCountByRole('baseManager') + this.spawnQueueCount('baseManager')) < 2)
            {
                this.addToSpawnQueue({role: 'baseManager'}, true);
            }

            if(this.labs.length > 0 && ((this.creepCountByRole('labManager') + this.spawnQueueCount('labManager')) < 1))
            {
                this.addToSpawnQueue({role: 'labManager'}, true);
            }

            if(this.terminal && ((this.creepCountByRole('terminalHauler') + this.spawnQueueCount('terminalHauler')) < 1))
            {
                let spawnTerminalHauler = false;
                for(resourceType in this.storage.store) 
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
            if(this.controller && this.controller.container)
            {
                if((this.creepCountByRole('upgrader') + this.spawnQueueCount('upgrader')) < 2)
                {
                    this.addToSpawnQueue({role: 'upgrader'});
                }
                // if((this.creepCountByRole('upgraderTransport') + this.spawnQueueCount('upgraderTransport')) < 1)
                // {
                //     this.addToSpawnQueue({role: 'upgraderTransport', targetID: this.controller.container.id, homeRoom: this.name});
                // }
            }
            else
            {
                if((this.creepCountByRole('upgrader') + this.spawnQueueCount('upgrader')) < 3)
                {
                    this.addToSpawnQueue({role: 'upgrader'});
                }
            }
        }
    };

Room.prototype.spawnResourceCreeps =
    function()
    {
        for(let sourceIndex in this.sources)
        {
            let source = this.sources[sourceIndex];

            if(source.container && !source.link)	
            {	
                if((source.container.transports.length + this.spawnQueueCount('containerTransport')) < 1)	
                {	
                    this.addToSpawnQueue({role: 'containerTransport', targetID: source.container.id, homeRoom: this.name}, true);	
                }	
            }

            if(!source.harvester && this.spawnQueueCount('containerHarvester') < 1)
            {
                this.addToSpawnQueue({role: 'containerHarvester', targetID: source.id, targetRoom: source.room.name}, true);
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

Room.prototype.clearSpawnQueue = 
    function ()
    {
        this.memory.spawnQueue = [];
    };    

Room.prototype.executeSpawns = 
    function ()
    {
        console.log('RoomBasedSpawn:' + this.name + ' spawnQueue.length:' + this.memory.spawnQueue.length);
        //Run spawn logic
        for (let name in this.spawns)
        {
            let spawn = this.spawns[name];
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

 Room.prototype.addRemoteMineTarget = 
    function (roomName)
    {
        this.memory.remoteMineTargetIds = this.memory.remoteMineTargetIds || [];

        this.memory.remoteMineTargetIds.push(roomName);
    };

Room.prototype.clearRemoteMineTargets = 
    function ()
    {
        this.memory.remoteMineTargetIds = [];
    }; 

Object.defineProperty(Room.prototype, 'remoteMineTargetRooms', {
    get: function() {
            // If we dont have the value stored locally
        if (!this._remoteMineTargetRooms) {
            //Make sure memory has been defined
            this.memory.remoteMineTargetIds = this.memory.remoteMineTargetIds || [];
           
            // Get the room objects from the id's in memory and store them locally
            this._remoteMineTargetRooms = this.memory.remoteMineTargetIds.map(roomName => { return Game.rooms[roomName].toString() });
            
        }
        // return the locally stored value
        return this._remoteMineTargetRooms;
    },
    enumerable: false,
    configurable: true
});

Room.prototype.spawnRemoteCreeps =
    function()
    {
        for(let roomIndex in this.memory.remoteMineTargetIds)
        {
            let remoteRoomId = this.memory.remoteMineTargetIds[roomIndex];
            let remoteRoom = Game.rooms[remoteRoomId];
            let spawnRemoteReserver = false; //Reset for each remote room

            console.log('spawnRemoteCreeps: ' + remoteRoomId);

            //remoteReserver
            if((Globals.creepCountByRole('remoteReserver', remoteRoomId) + this.spawnQueueCount('remoteReserver'))  <1 )
            {
                if(remoteRoom && remoteRoom.controller)
                {
                    if(!remoteRoom.controller.my && remoteRoom.controller.owner != undefined && remoteRoom.controller.upgradeBlocked < 100)
                    {
                        spawnRemoteReserver = true;
                    }
                    else if(remoteRoom.controller.owner == undefined)
                    {
                        if(remoteRoom.controller.reservation)
                        {
                            if(remoteRoom.controller.reservation.username != 'Kederk' || (remoteRoom.controller.reservation.username == 'Kederk' && remoteRoom.controller.reservation.ticksToEnd < 2000))
                            {
                                spawnRemoteReserver = true;
                            }
                        }
                        else
                        {
                            spawnRemoteReserver = true;
                        }
                    }
                }
                if(spawnRemoteReserver)
                {
                    this.addToSpawnQueue({role: 'remoteReserver', targetRoom: remoteRoomId});
                }
            }

            //Container Harvesters / Transports
            if(remoteRoom && (remoteRoom.controller.my || (remoteRoom.controller.reservation && remoteRoom.controller.reservation.username == 'Kederk')))
            {
                for(let sourceIndex in remoteRoom.sources)
                {
                    let source = remoteRoom.sources[sourceIndex];
    
                    if((!source.harvester && this.spawnQueueCount('containerHarvester') < 1) && remoteRoom.find(FIND_HOSTILE_CREEPS).length == 0)
                    {
                        this.addToSpawnQueue({role: 'containerHarvester', targetID: source.id, targetRoom: source.room.name}, true);
                    }

                    if(source.container && remoteRoom.find(FIND_HOSTILE_CREEPS).length == 0)
                    {
                        if((source.container.transports.length + this.spawnQueueCount('containerTransport')) < 3)
                        {
                            this.addToSpawnQueue({role: 'containerTransport', targetID: source.container.id, homeRoom: this.name}, true);
                        }
                    }  
                }

                if(remoteRoom.mineral && remoteRoom.mineral.container)
                {
                    if(remoteRoom.mineral.extractor && remoteRoom.mineral.ticksToRegeneration == undefined)
                    {
                        if(!remoteRoom.mineral.harvester && this.spawnQueueCount('mineralHarvester') < 1)
                        {
                            this.addToSpawnQueue({role: 'mineralHarvester', targetID: remoteRoom.mineral.id, targetRoom: remoteRoom.name});
                        }
                    }
                    if(remoteRoom.mineral.container.hasResource)
                    {
                        if((remoteRoom.mineral.container.transports.length + this.spawnQueueCount('containerTransport')) < 1)
                        {
                            this.addToSpawnQueue({role: 'containerTransport', targetID: remoteRoom.mineral.container.id, homeRoom: this.name});
                        }
                    }
                }

                //Only spawn if there is a container to defend or hostile creeps in the room to ease economy while getting a new room going
                let remoteHostileCount = remoteRoom.find(FIND_HOSTILE_CREEPS).length;
                if(remoteRoom.sources[0].container || remoteHostileCount > 0)
                { 
                    let attackerCount = 1;
                    if(remoteHostileCount)
                    {
                        attackerCount+= Math.floor(remoteHostileCount/3);
                    }
                    if(this.controller.level >= 5)
                    {
                        let skLairs = remoteRoom.find(FIND_HOSTILE_STRUCTURES, (structure) => structure.structureType == STRUCTURE_KEEPER_LAIR);
                        
                        if(skLairs && skLairs.length > 0)
                        {
                            if((Globals.creepCountByRole('skAttacker', remoteRoomId) + this.spawnQueueCount('skAttacker')) < 1)
                            {
                                this.addToSpawnQueue({role: 'skAttacker', targetRoom: remoteRoomId});
                            }
                            //Healer
                            if((Globals.creepCountByRole('healer', remoteRoomId) + this.spawnQueueCount('healer')) < 1)
                            {
                                this.addToSpawnQueue({role: 'healer', targetRoom: remoteRoomId});
                            }                            
                        }

                        if((Globals.creepCountByRole('skRanger', remoteRoomId) + this.spawnQueueCount('skRanger')) < attackerCount)
                        {
                            this.addToSpawnQueue({role: 'skRanger', targetRoom: remoteRoomId});
                        }
                    }
                    else
                    {
                        //Guards
                        if((Globals.creepCountByRole('guard', remoteRoomId) + this.spawnQueueCount('guard')) < attackerCount)
                        {
                            this.addToSpawnQueue({role: 'guard', targetRoom: remoteRoomId});
                        }
                    }

                    //fixer
                    if((Globals.creepCountByRole('fixer', remoteRoomId) + this.spawnQueueCount('fixer')) < 1)
                    {
                        this.addToSpawnQueue({role: 'fixer', targetRoom: remoteRoomId});
                    }
                }
            }
            else
            {
                //send a scout because we can't see the room.
                if((Globals.creepCountByRole('scout', remoteRoomId) + this.spawnQueueCount('scout')) < 1)
                {
                    this.addToSpawnQueue({role: 'scout', targetRoom: remoteRoomId});
                }
            }
        }            
    };
