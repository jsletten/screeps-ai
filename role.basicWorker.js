var roleBasicWorker = {
    
    spawnCreep: function(spawn) {
            var newName = spawn.createCreep([WORK,CARRY,MOVE], undefined,{role: 'basicWorker'}); 
            //Game.creeps[newName].memory.containerID = containerID;
            console.log('Spawning new BasicWorker: ' + newName);
            return newName;
    },
    
    /** @param {Creep} creep **/
    run: function(creep) {

        if(_.sum(creep.carry) < creep.carryCapacity) {
            var source = creep.pos.findClosestByRange(FIND_SOURCES);
        
            if(source) {
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }  
        }
        else {
            var target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {filter: (structure) => { 
                return (structure.structureType == STRUCTURE_SPAWN)}});            
                
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};

module.exports = roleBasicWorker;
