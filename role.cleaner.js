module.exports = {
    spawnCreep: function(spawn) {
        var newName = spawn.createCreep([CARRY,CARRY,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'cleaner'});
        console.log('Spawning new cleaner: ' + newName);  
        return newName;
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        if(_.sum(creep.carry)  == 0) {
            var target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);

            if(target) {
                creep.say('Resource!');
                if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            else 
            {
                target = creep.pos.findClosestByPath(FIND_TOMBSTONES, {filter: (tombstone) => { 
                    return (_.sum(tombstone.store) > 0)}}); 
            
                if(target)
                {
                    for(resourceType in target.store) 
                    {
                        if(creep.withdraw(target, resourceType) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target);
                        }
                    }
                }
                else
                {
                    //TODO: Shouldn't hardcode waiting location
                    creep.moveTo(24,24);
                }
            }
        }
        else 
        {
            let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => { 
                return ((structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && _.sum(structure.store) < structure.storeCapacity)}});            
            
            
            if(target === 'undefined' || target === null)
            {
                target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (structure) => { 
                    return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_TOWER ) && ((structure.energy < structure.energyCapacity)&&(structure.energy < 800))}});                    
            }

            if(target)
            {
                for(resourceType in creep.carry) 
                {
                    if(creep.transfer(target, resourceType) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
            }
            // else
            // {
            //     for(const resourceType in creep.carry) 
            //     {
            //         creep.transfer(target, resourceType);
            //     }
            // }
        }
    }
};
