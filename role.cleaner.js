var roleCleaner = {
    spawnCreep: function() {
        var newName = Game.spawns['Spawn1'].createCreep([CARRY,CARRY,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'cleaner'});
        console.log('Spawning new cleaner: ' + newName);  
        return newName;
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        if(_.sum(creep.carry)  == 0) {
            var target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            if(target) {
                creep.say('Resource!');
                if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            else {
                //TODO: Shouldn't hardcode waiting location
                creep.moveTo(24,24);
            }
        }
        else 
        {
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => { 
            return (structure.structureType == STRUCTURE_STORAGE) && (_.sum(structure.store) < structure.storeCapacity)}});            
        
            if(target === 'undefined' || target === null)
            {
                target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {filter: (structure) => { 
                    return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_TOWER ) && ((structure.energy < structure.energyCapacity)&&(structure.energy < 800))}});            
                    
            }

            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            else
            {
                for(const resourceType in creep.carry) 
                {
                    creep.transfer(target, resourceType);
                }
            }
        }
    }
};

module.exports = roleCleaner;
