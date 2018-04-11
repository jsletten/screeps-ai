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
            this._spawns = this.find(FIND_STRUCTURES, {filter: (structure) => { return (structure.structureType == STRUCTURE_SPAWN) }});
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
            let links = this.storage.pos.findInRange(FIND_MY_STRUCTURES, 2, {filter: (structure) => { 
                return (structure.structureType == STRUCTURE_LINK)}});
            
            if(storageLink)
            {        
                let linksWithEnergy = this.find(FIND_MY_STRUCTURES, {filter: (structure) => { 
                    return (structure.structureType == STRUCTURE_LINK) && (structure.energy > 0)}});            
                
                for(let link in linksWithEnergy)
                {
                    if(linksWithEnergy[link].id != storageLink.id)
                    {
                        linksWithEnergy[link].transferEnergy(storageLink);
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

    Room.prototype.addToSpawnQueue = 
    function (creepMemory)
    {
        this.memory.spawnQueue = this.memory.spawnQueue || [];
        this.memory.spawnQueue.push(creepMemory);
    };

    Room.prototype.executeSpawns = 
    function ()
    {
        //Run spawn logic
        for (let name in this.spawns)
        {
            let spawn = this.spawns[name];
            
            console.log('RoomBasedSpawn:' + this.spawns[name].name);
        
            spawn.spawnNextInQueue();
            spawn.spawnCreepsIfNecessary();   
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