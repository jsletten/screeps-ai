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
            console.log('move');
        }
        else
        {
            var  targets = creep.room.find(FIND_CONSTRUCTION_SITES);

            if(targets.length == 0 && _.sum(creep.carry) == 0) {
                creep.suicide();
                return;
            }
            
            if(creep.carry[RESOURCE_ENERGY] > 0) {
                if(targets.length > 0) {
                    console.log('build');
                    if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffff00'}});
                    }
                }
                else
                {
                    var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => { 
                        return (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] < structure.storeCapacity}});            
                    console.log('transfer')
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
            else 
            {
                console.log('find energy');
                var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => { 
                    return ((structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && structure.room == creep.room && structure.store[RESOURCE_ENERGY] > 0)}});            
                
                if(!target)
                {
                    target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => { 
                        return ((structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) && (structure.energy > 0) && (structure.room == creep.room))}});            
                }
                
                if(target)
                {
                    console.log('withdraw: ' + target.structureType);
                    if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
                    }
                }
            }
        }
    }
};

module.exports = roleBuilder;