var roleBasicWorker = {
    
    spawnCreep: function() {
            var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'basicWorker'});
            //Game.creeps[newName].memory.containerID = containerID;
            console.log('Spawning new BasicWorker: ' + newName);
            return newName;
    },
    
    /** @param {Creep} creep **/
    run: function(creep, remote = false) {


        var source = creep.pos.findClosestByRange(FIND_SOURCES);
        
        if(source) {
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }     
            
    }
};

module.exports = roleContainerHarvester;
