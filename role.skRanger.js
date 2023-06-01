module.exports = {
    buildBody: function(maxEnergy) 
    {
        let body = [];
        let numberOfParts = Math.floor(maxEnergy / 960) * 10;
        numberOfParts = Math.min(numberOfParts, 50); // limit guard size for now
        
        for (let i = 0; i < (numberOfParts/10); i++)
        {
            body.push(TOUGH);
        }
        for (let i = 0; i < ((numberOfParts/10)*5); i++)
        {
            body.push(MOVE);
        }
        for (let i = 0; i < ((numberOfParts/10)*3); i++)
        {
            body.push(RANGED_ATTACK);
        }
        for (let i = 0; i < (numberOfParts/10); i++)
        {
            body.push(HEAL);
        }

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
            let target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
            if(target) 
            {
                //Attack Source Keeper
                if(creep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffff00'}});
                }
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
        //Always try to heal
        creep.heal(creep);
    }
};