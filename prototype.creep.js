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
            target = this.room.storage;
        }
        
        if(target)
        {
            for(resourceType in this.store) 
            {
                if(this.transfer(target, resourceType) == ERR_NOT_IN_RANGE) {
                    this.moveTo(target, this.moveOptions);
                }
            }
        }
    }

Creep.prototype.deliverEnergy = 
    function (target)
    {
        //Extensions
        if(!target && this.room.empty_extensions.length > 0)
        {
            target = this.pos.findClosestByPath(this.room.empty_extensions)
        }
        
        //Spawns
        if(!target && this.room.empty_spawns.length > 0)
        {
            target = this.pos.findClosestByPath(this.room.empty_spawns); 
        }

        //Tower under 50%
        if(!target && this.room.empty_towers.length > 0)
        {
            target = this.pos.findClosestByPath(this.room.empty_towers);
        }

        //Controller Container under 50% or has room for our whole load
        if(!target)
        {
            let roomController = this.room.controller;
            if(roomController && !roomController.link && roomController.container && (roomController.container.store.getUsedCapacity(RESOURCE_ENERGY) < roomController.container.store.getCapacity(RESOURCE_ENERGY)/2))
            {
                target = roomController.container;
            }
        }                 

        //Storage under 50%
        if(!target && this.room.storage && this.room.storage.store[RESOURCE_ENERGY] < this.room.storage.store.getCapacity(RESOURCE_ENERGY)/2)
        {
            target = this.room.storage;
        }

        // //Spawn Containers
        // if(!target)
        // {
        //     let results = this.room.spawns[0].pos.findInRange(FIND_STRUCTURES, 2, {filter: (structure) => { 
        //         return (structure.structureType == STRUCTURE_CONTAINER) && (structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0)}});

        //     if(results.length > 0)
        //     {
        //         target = this.pos.findClosestByPath(results);
        //     }    
        // }

        if(target)
        {
            if(this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
            {
                this.moveTo(target, this.moveOptions);
            }
            else
            {
                //We're done clear target
                target = undefined;
            }
        }

        return target;
    };

Object.defineProperty(Creep.prototype, 'isFull', 
{
    get: function() 
    {
        if (!this._isFull) 
        {
            this._isFull = _.sum(this.carry) === this.carryCapacity;
        }
        return this._isFull;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Creep.prototype, 'moveOptions', 
{
    get: function() 
    {
        if (!this._moveOptions) 
        {
            this._moveOptions = {};
        }
        return this._moveOptions;
    },
    set: function(newValue) 
    {
        // We set the stored private variable so the next time the getter is called 
        // it returns this new value
        this._moveOptions = newValue;
    },
    enumerable: false,
    configurable: true
});