var roleBuilder = {

    spawnCreep: function(spawn, targetRoom = 'E32N13') {
        if(spawn.room.energyCapacityAvailable >= 600)
        {
            var newName = spawn.createCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], undefined, {role: 'builder', targetRoom: targetRoom});
            console.log('Spawning new builder(large): ' + newName);  
        }
        else if(spawn.room.energyCapacityAvailable >= 400)
        {
            var newName = spawn.createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'builder', targetRoom: targetRoom});
            console.log('Spawning new builder(med): ' + newName);  
        }
        else
        {
            var newName = spawn.createCreep([WORK,CARRY,MOVE], undefined, {role: 'builder', targetRoom: targetRoom});
            console.log('Spawning new builder(small): ' + newName);
        }
        return;
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.room.name != creep.memory.targetRoom)
        {
            // find exit to target room
            var exit = creep.room.findExitTo(creep.memory.targetRoom);
            // move to exit
            creep.moveTo(creep.pos.findClosestByRange(exit));
        }
        else
        {
            var  targets = creep.room.find(FIND_CONSTRUCTION_SITES, {filter: (structure) => {return (structure.structureType == STRUCTURE_STORAGE)}});
            if(targets.length == 0) {
                targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            }
            if(targets.length == 0 && _.sum(creep.carry) == 0) {
                creep.suicide();
                return;
            }
            
            if(creep.carry[RESOURCE_ENERGY] > 0) {
                if(targets.length > 0) {
                    //creep.say('build');
                    if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffff00'}});
                    }
                }
                else
                {
                    var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => { 
                        return (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] < structure.storeCapacity}});            
                
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
            else 
            {
                var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => { 
                    return (structure.structureType == STRUCTURE_STORAGE && structure.room == creep.room)}});            
                
                if(target === 'undefined' || target === null)
                {
                    target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {filter: (structure) => { 
                        return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_CONTAINER ) && (structure.energy > 0 && structure.room == creep.room)}});            
                }
                if(target)
                {
                    //creep.say('withdraw');
                    if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
                    }
                }
            }
        }
    }
};

module.exports = roleBuilder;