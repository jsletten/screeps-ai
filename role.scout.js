module.exports = {
    buildBody: function(maxEnergy) 
    {
        let body = [];

        body.push(MOVE);

        return body;
    },
    
    /** @param {Creep} creep **/
    run: function(creep) 
    {
        if(creep.room.name != creep.memory.targetRoom)
        {
            // find exit to target room
            let exit = creep.room.findExitTo(creep.memory.targetRoom);
            creep.moveTo(creep.pos.findClosestByRange(exit));
        }
        else
        {    
            //TODO: Shouldn't hardcode waiting location
            creep.moveTo(24,24, {maxRooms:1});
        }
    }
};