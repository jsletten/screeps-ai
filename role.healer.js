module.exports = {
    buildBody: function(maxEnergy) 
    {
        let body = [];
        let numberOfParts = 2;

        //1x CARRY - 1X MOVE
        numberOfParts = Math.floor(maxEnergy / 310) * 3;
        numberOfParts = Math.min(numberOfParts, 48); // limit healer size for now

        for (let i = 0; i < numberOfParts/3; i++)
        {
            body.push(TOUGH);
        }
        for (let i = 0; i < numberOfParts/3; i++)
        {
            body.push(HEAL);
            body.push(MOVE);
        }

        return body;
    },    
    
    /** @param {Creep} creep **/
    run: function(creep) 
    {
        let healTarget = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: function(object) {
                return object.hits < object.hitsMax;
            }
        });

        let moveTarget;

        if(healTarget)
        {
            if(creep.heal(healTarget) == ERR_NOT_IN_RANGE) {
                moveTarget = healTarget;
            }
        }

        if(creep.getActiveBodyparts(TOUGH) == 0)
        {
            if(Game.flags.rallyFlag)
            {
                moveTarget = Game.flags.rallyFlag;
            }
        }
        else if(creep.room.name != creep.memory.targetRoom)
        {
            // find exit to target room
            let exit = creep.room.findExitTo(creep.memory.targetRoom);
            moveTarget = creep.pos.findClosestByRange(exit);
        }
        
        if(moveTarget)
        {
            creep.moveTo(moveTarget);
        }
        else
        {
            let skLairs = creep.room.skLairs;

            if(skLairs.length > 0)
            {
                if(creep.pos.getRangeTo(skLairs[0]) > 3)
                {
                    creep.moveTo(skLairs[0]);
                }
            }  
            else
            {
                creep.moveTo(25,25); //TODO make this smarter
            }  
        }
        
    }
};