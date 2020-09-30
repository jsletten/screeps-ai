module.exports = {
    buildBody: function(maxEnergy) 
    {
        maxEnergy = Math.min(maxEnergy, 1500);
        let body = [];
        let numberOfParts = Math.floor(maxEnergy / 150) * 3;

        //1 MOVE part for every 2 CARRY parts
        for (let i = 0; i < ((numberOfParts/3)*2); i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < (numberOfParts/3); i++) {
            body.push(MOVE);
        }
        return body;
    },
    
    /** @param {Creep} creep **/
    run: function(creep) {

        let target;

        if(creep.store.getUsedCapacity() == 0 && creep.ticksToLive < 50)
        {
            creep.suicide();
        }
        else if(creep.memory.gather == true)
        {
            if(creep.store.getFreeCapacity() == 0)
            {
                creep.memory.gather = false;
            }
            else
            {
                //Gather Energy
                //Mining Container (closest over 100 seems to work could sort by fullest)
                let sourceContainers = [];
                for(let sourceIndex in creep.room.sources)
                {
                    let source = creep.room.sources[sourceIndex];
        
                    if(source.container && !source.link && source.container.store[RESOURCE_ENERGY] > 100)
                    {
                        sourceContainers.push(source.container);
                    }
                }

                if(sourceContainers.length > 0)
                {
                    target = creep.pos.findClosestByPath(sourceContainers);
                }

                //Storage
                if(!target && creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] > 0)
                {
                    target = creep.room.storage;
                }

                //Spawn Containers
                if(!target)
                {
                    let results = creep.room.spawns[0].pos.findInRange(FIND_STRUCTURES, 2, {filter: (structure) => { 
                        return (structure.structureType == STRUCTURE_CONTAINER) && (structure.store[RESOURCE_ENERGY] > 0)}});

                    if(results.length > 0)
                    {
                        target = creep.pos.findClosestByPath(results);
                    }  
                }

                if(target)
                {
                    if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                    {
                        creep.moveTo(target, {reusePath: 10});
                    }
                }

            }
        }
        else
        {
            //Deliver Energy

            if(creep.store.getUsedCapacity() == 0)
            {
                creep.memory.gather = true;
            }
            else
            {
                //Extensions
                if(!target)
                {
                    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => { 
                        return ((structure.structureType == STRUCTURE_EXTENSION) && (structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0))}}); 
                }
                
                //Spawns
                if(!target)
                {
                    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => { 
                        return ((structure.structureType == STRUCTURE_SPAWN) && (structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0))}}); 
                }

                //Controller Container under 50%
                if(!target)
                {
                    let roomController = creep.room.controller;
                    if(roomController && roomController.container && !roomController.link && roomController.container.store[RESOURCE_ENERGY] < roomController.container.store.getCapacity(RESOURCE_ENERGY)/2)
                    {
                        target = roomController.container;
                    }
                }

                //Tower under 50%
                if(!target)
                {
                    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => { 
                        return ((structure.structureType == STRUCTURE_TOWER) && (structure.store[RESOURCE_ENERGY] < (structure.store.getCapacity(RESOURCE_ENERGY)/2)))}}); 
                }

                //Spawn Containers
                if(!target)
                {
                    let results = creep.room.spawns[0].pos.findInRange(FIND_STRUCTURES, 2, {filter: (structure) => { 
                        return (structure.structureType == STRUCTURE_CONTAINER) && (structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0)}});

                    if(results.length > 0)
                    {
                        target = creep.pos.findClosestByPath(results);
                    }    
                }

                //Storage under 50%
                if(!target && creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] < creep.room.storage.store.getCapacity(RESOURCE_ENERGY)/2)
                {
                    target = creep.room.storage;
                }

                if(target)
                {
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
                else
                {
                    //Couldn't find a delivery target...
                    //Gather if not full or HOLD it till someone needs it
                    if(creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
                    {
                        creep.memory.gather = true;
                    }
                }
            }
        }
    }
};

