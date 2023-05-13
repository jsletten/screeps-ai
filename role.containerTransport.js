module.exports = {
    buildBody: function(maxEnergy) 
    {
        maxEnergy = Math.min(maxEnergy, 1200);
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
    run: function(creep) 
    {
        let moveOptions = {reusePath: 2, visualizePathStyle: {stroke: '#ffff00'}};

        if(creep.store.getUsedCapacity() == 0) 
        {
            if(creep.room.name == creep.memory.homeRoom && creep.ticksToLive < 100)
            {
                creep.suicide();
            }

            let targetContainer = Game.getObjectById(creep.memory.targetID);

            if(creep.room.name != targetContainer.room.name)
            {
                // move to home room
                creep.moveTo(targetContainer, moveOptions);
            }                 
            else if(targetContainer && targetContainer.store.getUsedCapacity() < 100)
            {
                //Act as Cleaner
                let target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);

                if(target) {
                    creep.say('Resource!');
                    if(creep.pickup(target) == ERR_NOT_IN_RANGE) 
                    {
                        creep.moveTo(target, moveOptions);
                    }
                }
                else 
                {
                    target = creep.pos.findClosestByPath(FIND_TOMBSTONES, {filter: (tombstone) => { 
                        return (tombstone.store.getUsedCapacity() > 0)}}); 
                
                    if(target)
                    {
                        for(resourceType in target.store) 
                        {
                            if(creep.withdraw(target, resourceType) == ERR_NOT_IN_RANGE) 
                            {
                                creep.moveTo(target, moveOptions);
                            }
                        }
                    }
                    else
                    {
                        if(creep.pos.getRangeTo(targetContainer) > 2)
                        //Nothing else to do but move toward container.
                        creep.moveTo(targetContainer, moveOptions);
                    }
                }
            }
            else if(target)
            {
                //Get resources from container
                for(resourceType in target.store) 
                {
                    if(creep.withdraw(target, resourceType) == ERR_NOT_IN_RANGE) 
                    {
                        creep.moveTo(target, moveOptions);
                    }
                }
            }
        }
        else {
            if(creep.room.name != creep.memory.homeRoom)
            {
                // move to home room
                creep.moveTo(Game.rooms[creep.memory.homeRoom].spawns[0], moveOptions);
            }
            else
            {
                if(creep.store.getUsedCapacity() == creep.store.getUsedCapacity(RESOURCE_ENERGY))
                {
                    creep.deliverEnergy();
                }
                else
                {
                    creep.deliver();
                }
            }
        }
    }
};

