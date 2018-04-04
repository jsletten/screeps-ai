module.exports = {
    spawnCreep: function(spawn, targetRoom) 
    {
        var body = [];
        var maxEnergy
        var numberOfParts;

        maxEnergy = spawn.room.energyCapacityAvailable;

        //1x CARRY - 1X MOVE
        numberOfParts = Math.floor(maxEnergy / 130) * 2;
        numberOfParts = Math.min(numberOfParts, 20); // limit guard size for now
        for (let i = 0; i < numberOfParts/2; i++)
        {
            body.push(ATTACK);
            body.push(MOVE);
        }

        var result = spawn.createCreep(body, undefined, {role: 'guard', targetRoom: targetRoom});
        console.log('Spawning new guard(' + numberOfParts + '): targetRoom(' + targetRoom + '): ' + result);
        
        return;
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
        else
        {    
            var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(!target) {
                target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES)
            }
            
            if(target)
            {
                if(creep.Attack(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            else
            {
                creep.moveTo(25,25); //TODO make this smarter
            }
        }
    }
};