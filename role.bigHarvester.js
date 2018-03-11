var roleBigHarvester = {
    
    spawnCreep: function(allowSpawning) {
        if(allowSpawning) {
            var newName = Game.spawns['Spawn1'].createCreep([CARRY,CARRY,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'bigHarvester'});
            console.log('Spawning new bigHarvester: ' + newName);
            return newName;
        }
    },
    
    /** @param {Creep} creep **/
    run: function(creep) {
        if(_.sum(creep.carry)  == 0) {

           var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => ((structure.structureType == STRUCTURE_STORAGE ) && (structure.store[RESOURCE_ENERGY] > 0)) });   
                    
            if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            
        }
        else {
            
            var target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {filter: (structure) => { 
            return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_TOWER ) && ((structure.energy < structure.energyCapacity)&&(structure.energy < 800))}});            
            
            if(target)
            {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
                }
            }
        }
    }
};

module.exports = roleBigHarvester;
