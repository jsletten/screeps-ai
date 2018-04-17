module.exports = {
    spawnCreep: function(spawn, targetRoom) 
    {
        var body = [];
        var maxEnergy
        var numberOfParts;

        maxEnergy = spawn.room.energyCapacityAvailable;

        //1x CARRY - 1X MOVE
        numberOfParts = Math.floor(maxEnergy / 300) * 2;
        numberOfParts = Math.min(numberOfParts, 50); // limit healer size for now
        for (let i = 0; i < numberOfParts/2; i++)
        {
            body.push(HEAL);
            body.push(MOVE);
        }

        var result = spawn.createCreep(body, undefined, {role: 'healer', targetRoom: targetRoom});
        console.log('Spawning new healer(' + numberOfParts + '): targetRoom(' + targetRoom + '): ' + result);
        
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
    
        var target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: function(object) {
                return object.hits < object.hitsMax;
            }
        });
        
        if(target)
        {
            if(creep.heal(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
};