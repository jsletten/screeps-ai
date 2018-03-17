var roleClaimer = {
    
    spawnCreep: function() 
    {
        var spawn = Game.spawns['Spawn1'];
        if(spawn.room.energyCapacityAvailable >= 1300)
        {
            var newName = Game.spawns['Spawn1'].createCreep([CLAIM,CLAIM,MOVE,MOVE], undefined,{role: 'claimer'}); 
            console.log('Spawning new Claimer(med): ' + newName);
        }
        else
        {
            var newName = Game.spawns['Spawn1'].createCreep([CLAIM,MOVE], undefined,{role: 'claimer'}); 
            console.log('Spawning new Claimer(small): ' + newName);
        }
        
        return;
    },
    
    /** @param {Creep} creep **/
    run: function(creep) 
    {
        if(Game.flags.claimFlag)
        {
            if(creep.room == Game.flags.claimFlag.room)
            {
                if(creep.room.controller && !creep.room.controller.my) {
                    if(creep.attackController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }
                else if(creep.room.controller && creep.room.controller.owner == 'undefined')
                {
                    if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }
            }
            else
            {
                creep.moveTo(Game.flags.claimFlag);
            }
        }
    }
};

module.exports = roleClaimer;
