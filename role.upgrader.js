var roleUpgrader = {
    spawnCreep: function() {
        var spawn = Game.spawns['Spawn1'];

        if (spawn.energyCapacity < 700)
        {
            var newName = spawn.createCreep([WORK,CARRY,MOVE], undefined, {role: 'upgrader'});
            console.log('Spawning new upgrader(small): ' + newName);
        }
        else
        {
            var newName = spawn.createCreep([WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE], undefined, {role: 'upgrader'});
            console.log('Spawning new upgrader(large): ' + newName);
        }
        
        return;
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy == 0) {
            
            var target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {filter: (structure) => { 
                return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_CONTAINER ) && (structure.energy > 0)}});            
                
                if(target)
                {
                    creep.say('withdraw');
                    if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
                    }
                }
        }
        else
        {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
};

module.exports = roleUpgrader;