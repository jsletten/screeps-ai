module.exports = {  
    buildBody: function(maxEnergy) 
    {
        let body = [];

        if(maxEnergy < 700)
        {
            body.push(WORK);
            body.push(CARRY);
            body.push(MOVE);
        }
        else
        {
            body.push(WORK);
            body.push(WORK);
            body.push(WORK);
            body.push(WORK);
            body.push(WORK);
            body.push(CARRY);
            body.push(MOVE);
            body.push(MOVE);
            body.push(MOVE);
        }

        return body;
    },

    /** @param {Creep} creep **/
    run: function(creep) 
    {
        if (creep.room.name != creep.memory.targetRoom)
        {
            // find exit to target room
            let exit = creep.room.findExitTo(creep.memory.targetRoom);
            // move to exit
            creep.moveTo(creep.pos.findClosestByRange(exit));
        }
        else
        {
            let target = Game.getObjectById(creep.memory.targetID);
            
            if(creep.harvest(target) == ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(target);
            }

            creep.transfer(target.link, RESOURCE_ENERGY);        
        }
    }
};