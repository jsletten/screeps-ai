module.exports = {
    buildBody: function(maxEnergy)
    {
        let body = [];
        let numberOfParts = Math.floor(maxEnergy /650) * 2;
        numberOfParts = Math.min(numberOfParts, 50);

        for (let i = 0; i < numberOfParts/2; i++)
        {
            body.push(CLAIM);
            body.push(MOVE);
        }

        return body;
    },

    run: function(creep) 
    {
        if(creep.memory.path && creep.memory.path.length > 0)
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
            if (creep.room.name != creep.memory.targetRoom)
            {
                // find exit to target room
                var exit = creep.room.findExitTo(creep.memory.targetRoom);
                // move to exit
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
            else
            {
                //console.log('Controller.owner:' + creep.room.controller.owner);
                if(creep.room.controller.owner == undefined)
                {
                    if(creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }
                else if(!creep.room.controller.my) {
                    if(creep.attackController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }
                creep.signController(creep.room.controller, "Any creeps entering this territory will be considered hostile.")
            }
        }
    }
};