var Globals = require('globals');

Creep.prototype.runRole =
    function () 
    {
        Globals.roles[this.memory.role].run(this);
    };

Creep.prototype.deliver = 
    function(target)
    {
        if(!target)
        {
            target = creep.room.storage;
        }
        
        if(target)
        {
            for(resourceType in creep.store) 
            {
                if(creep.transfer(target, resourceType) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, moveOptions);
                }
            }
        }
    }

Creep.prototype.deliverEnergy = 
    function (target)
    {
        //Extensions
        if(!target)
        {
            target = this.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => { 
                return ((structure.structureType == STRUCTURE_EXTENSION) && (structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0))}}); 
        }
        
        //Spawns
        if(!target)
        {
            target = this.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => { 
                return ((structure.structureType == STRUCTURE_SPAWN) && (structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0))}}); 
        }

        //Tower under 50%
        if(!target)
        {
            target = this.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => { 
                return ((structure.structureType == STRUCTURE_TOWER) && (structure.store[RESOURCE_ENERGY] < (structure.store.getCapacity(RESOURCE_ENERGY)/2)))}}); 
        }

        //Controller Container under 50% or has room for our whole load
        if(!target)
        {
            let roomController = this.room.controller;
            if(roomController && roomController.container && !roomController.link && (roomController.container.store[RESOURCE_ENERGY] < roomController.container.store.getCapacity(RESOURCE_ENERGY)/2) || (roomController.container.store.getFreeCapacity(RESOURCE_ENERGY) > creep.store.getUsedCapacity(RESOURCE_ENERGY)))
            {
                target = roomController.container;
            }
        }                 

        //Spawn Containers
        if(!target)
        {
            let results = this.room.spawns[0].pos.findInRange(FIND_STRUCTURES, 2, {filter: (structure) => { 
                return (structure.structureType == STRUCTURE_CONTAINER) && (structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0)}});

            if(results.length > 0)
            {
                target = this.pos.findClosestByPath(results);
            }    
        }

        //Storage under 50%
        if(!target && this.room.storage && this.room.storage.store[RESOURCE_ENERGY] < this.room.storage.store.getCapacity(RESOURCE_ENERGY)/2)
        {
            target = this.room.storage;
        }

       

        if(target)
        {
            if(this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(target);
            }
        }

        return target;
    };

Object.defineProperty(Creep.prototype, 'isFull', {
    get: function() {
        if (!this._isFull) {
            this._isFull = _.sum(this.carry) === this.carryCapacity;
        }
        return this._isFull;
    },
    enumerable: false,
    configurable: true
});