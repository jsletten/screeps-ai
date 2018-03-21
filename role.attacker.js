var roleAttacker = {
    
    spawnCreep: function(spawn, targetRoom) 
    {
        var newName = spawn.createCreep([MOVE,MOVE,ATTACK,ATTACK], undefined,{role: 'attacker', targetRoom: targetRoom}); 
        console.log('Spawning new Attacker: ' + newName);
        return newName;
    },
    
    /** @param {Creep} creep **/
    run: function(creep) 
    {
        if(creep.room.name != creep.memory.targetRoom)
        {
            // find exit to target room
            var exit = creep.room.findExitTo(creep.memory.targetRoom);
            creep.moveTo(creep.pos.findClosestByRange(exit));
        }
    
        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(!target) {
            target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES)
        }

        if(target)
        {
            if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
};

module.exports = roleAttacker;
