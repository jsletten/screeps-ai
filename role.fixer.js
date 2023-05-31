module.exports = {
    buildBody: function(maxEnergy) 
    {
        let body = [];
 
        body.push(WORK);
        body.push(CARRY);
        body.push(MOVE);
        body.push(MOVE);

        return body;
    },
    
    /** @param {Creep} creep **/
    run: function(creep) 
    {
        if(creep.room.name != creep.memory.targetRoom)
        {
            // find exit to target room
            let exit = creep.room.findExitTo(creep.memory.targetRoom);
            creep.moveTo(creep.pos.findClosestByRange(exit));
        }
        else
        {    
            if(creep.carry[RESOURCE_ENERGY]  == 0) 
            {
                //FILL AT CONTAINER
                let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => ((structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && (structure.store[RESOURCE_ENERGY] > 0))});            
                
                if(target)
                {
                    if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                    {
                        creep.moveTo(target, {maxRooms:1});
                    }
                }
                else
                {
                    target = creep.pos.findClosestByPath(creep.room.dropped_resources);
                    if(target) {
                        creep.say('Resource!');
                        if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target, {maxRooms:1});
                        }
                    }
                    else 
                    {
                        target = creep.pos.findClosestByPath(FIND_TOMBSTONES, {filter: (tombstone) => { 
                            return (tombstone.store[RESOURCE_ENERGY] > 0)}}); 
                    
                        if(target)
                        {
                            if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(target, {maxRooms:1});
                            }
                        }
                        else
                        {
                            //TODO: Shouldn't hardcode waiting location
                            creep.moveTo(24,24);
                        }
                    }
                }
                
            }
            else
            {
                let  targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);

                if(targets.length > 0) {
                    creep.say('building')
                    if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {maxRooms:1, visualizePathStyle: {stroke: '#ffff00'}});
                    }
                }
                else
                {
                    let maxRepairAmount = 100000;
                    if(creep.room && creep.room.controller && creep.room.controller.my)
                    {
                        maxRepairAmount = maxRepairAmount * creep.room.controller.level;
                    }
                    //Fix closest damaged structure
                    let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: object => (object.hits < Math.min(object.hitsMax, maxRepairAmount))});
                
                    if(target)
                    {
                        creep.say('repairing');
                        if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target, {maxRooms:1});
                        }
                    }
                }
            }
        }
    }
};