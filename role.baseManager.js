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

        if(creep.memory.targetID)
        {
            target = Game.getObjectById(creep.memory.targetID);
        }

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
                //Mining Container
                let sourceContainers = [];
                for(let sourceIndex in creep.room.sources)
                {
                    let source = creep.room.sources[sourceIndex];
        
                    if(source.container && !source.link && source.container.store[RESOURCE_ENERGY] > (creep.room.controller.level*50))
                    {
                        sourceContainers.push(source.container);
                        if(source.id == creep.memory.targetID)
                        {
                            //Target Mining Container
                            target = Game.getObjectById(source.id);
                        }
                    }
                }

                //Closest Mining Container
                if(!target && sourceContainers.length > 0)
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
                        creep.moveTo(target);
                    }
                    else
                    {
                        if(creep.store.getUsedCapacity() > 0)
                        {
                            creep.memory.gather = false;
                            creep.targetID = '';
                        }
                    }
                }
                else
                {
                    let resources = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {filter: (d) => {return (d.resourceType == RESOURCE_ENERGY)}});

                    if(resources && resources.length > 0) 
                    {
                        creep.say('Resource!');
                        if(creep.pickup(resources[0]) == ERR_NOT_IN_RANGE)
                        {
                            creep.moveTo(resources[0]);
                        }
                    }
                    else
                    {
                        if(creep.store.getUsedCapacity() > 0)
                        {
                            creep.memory.gather = false;
                            creep.memory.targetID = '';
                        }
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
                creep.memory.targetID = '';
            }
            else
            {   
                target = creep.deliverEnergy(target);
                if(target)
                {
                    creep.memory.targetID = target.id;
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

