module.exports = {
    buildBody: function(maxEnergy)
    {
        let body = [];
        body.push(CLAIM);
        body.push(MOVE);
        return body;
    },

    run: function(creep) 
    {
        if(creep.memory.path.length > 0)
        {
            let nextPos = new RoomPosition(creep.memory.path[0].x, creep.memory.path[0].y, creep.memory.path[0].roomName);

            if(creep.pos.isEqualTo(nextPos))
            {
                creep.memory.path.shift();
            }
            else
            {
                creep.moveTo(nextPos);
            }  
        }
        else
        {   
            if(Game.flags.remoteClaimFlag)
            {
                if(creep.room == Game.flags.remoteClaimFlag.room)
                {
                    console.log('Controller.owner:' + creep.room.controller.owner);
                    if(creep.room.controller.owner == undefined)
                    {
                        if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) 
                        {
                            creep.moveTo(creep.room.controller);
                        }
                    }
                    else if(!creep.room.controller.my) 
                    {
                        if(creep.attackController(creep.room.controller) == ERR_NOT_IN_RANGE) 
                        {
                            creep.moveTo(creep.room.controller);
                        }
                    }
                    else
                    {
                        if(creep.signController(creep.room.controller, "Any creeps entering this territory will be considered hostile.") == ERR_NOT_IN_RANGE)
                        {
                            creep.moveTo(creep.room.controller);
                        }
                    }
                }
                else
                {
                    console.log('remoteClaimer(' + creep.name + ') using fallback movement...')
                    creep.moveTo(Game.flags.remoteClaimFlag);
                }
            }
        }
    }
};