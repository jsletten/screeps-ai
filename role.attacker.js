var roleAttacker = {
    
    spawnCreep: function() 
    {
        var newName = Game.spawns['Spawn1'].createCreep([ATTACK,ATTACK,MOVE,MOVE], undefined,{role: 'attacker'}); 
        console.log('Spawning new BasicWorker: ' + newName);
        return newName;
    },
    
    /** @param {Creep} creep **/
    run: function(creep) 
    {
        if(creep.room == Game.flags.attackFlag.room)
        {
            target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
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
        else
        {
            creep.moveTo(Game.flags.attackFlag);
        }
    }
};

module.exports = roleAttacker;
