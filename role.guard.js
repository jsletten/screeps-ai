module.exports = {
    spawnCreep: function(spawn, targetRoom) 
    {
        var body = [];
        var maxEnergy
        var numberOfParts;

        maxEnergy = spawn.room.energyCapacityAvailable;

        //1x CARRY - 1X MOVE
        numberOfParts = Math.floor(maxEnergy / 200) * 2;
        numberOfParts = Math.min(numberOfParts, 10); // limit guard size for now
        for (let i = 0; i < numberOfParts/2; i++)
        {
            body.push(RANGED_ATTACK);
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
    
        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(!target) {
            target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES)
        }
        
        if(target)
        {
            if(creep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
};