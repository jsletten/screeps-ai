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
            let roomPos = new RoomPosition(24, 24, creep.memory.targetRoom);
            creep.moveTo(roomPos);
        }
        else
        {    
            //TODO: Shouldn't hardcode waiting location
            creep.moveTo(24,24);
        }
    }
};