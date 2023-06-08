module.exports = {
    buildBody: function(maxEnergy) 
    {
        let body = [];
        let numberOfParts = Math.floor(maxEnergy / 820) * 10;
        numberOfParts = Math.min(numberOfParts, 50); // limit guard size for now
        
        // 25 Move (1350)
        // 20 Attack (1600)
        // 5 Heal (1250)

        for (let i = 0; i < ((numberOfParts/10)*5); i++)
        {
            body.push(MOVE);
        }
        for (let i = 0; i < ((numberOfParts/10)*4); i++)
        {
            body.push(ATTACK);
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
            
            if(!target)
            {
                target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
            }
            
            if(target) 
            {
                //Attack Source Keeper
                if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffff00'}});
                }
            }
            else
            {
                let skLairs = creep.room.skLairs;

                if(skLairs.length > 0)
                {
                    if(creep.pos.getRangeTo(skLairs[0]) > 1)
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