var roleAttacker = {
    
    spawnCreep: function() 
    {
        var newName = Game.spawns['Spawn1'].createCreep([ATTACK,ATTACK,MOVE,MOVE], undefined,{role: 'attacker'}); 
        console.log('Spawning new Attacker: ' + newName);
        return newName;
    },
    
    /** @param {Creep} creep **/
    run: function(creep) 
    {
        if(Game.flags.attackFlag)
        {
            if(creep.room != Game.flags.attackFlag.room)
            {
                creep.moveTo(Game.flags.attackFlag);
            }
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
