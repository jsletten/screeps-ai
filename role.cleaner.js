module.exports = {
    buildBody: function(maxEnergy)
    {
        let body = [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE];

        return body;
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.store.getUsedCapacity() == 0) {
            var target = creep.pos.findClosestByPath(creep.room.dropped_resources);

            if(target) {
                creep.say('Resource!');
                if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            else 
            {
                target = creep.pos.findClosestByPath(creep.room.tombstones); 

                if(!target)
                {
                    //Clean out containers that have something other than energy in them.  This will potentially try to unload mineral containers in late game...
                    target = creep.pos.findClosestByPath(creep.room.containers, {filter: (structure) => { 
                        return (structure.store.getUsedCapacity(RESOURCE_ENERGY) < structure.store.getUsedCapacity())}});
                }
            
                if(target)
                {
                    for(resourceType in target.store) 
                    {
                        if(creep.withdraw(target, resourceType) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target);
                        }
                    }
                }
            }
        }
        else 
        {
            let target = creep.room.storage;

            if(target)
            {
                for(resourceType in creep.store) 
                {
                    if(creep.transfer(target, resourceType) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
            }
        }
    }
};
