module.exports = {
    spawnCreep: function(targetRoom) 
    {
        //DO NOT USE
    },

    buildBody: function(maxEnergy) 
    {
        let body = [];

        //TODO: Dynamically create based on maxEnergy
        body.push(MOVE);
        body.push(MOVE);
        body.push(ATTACK);
        body.push(ATTACK);

        return body;
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