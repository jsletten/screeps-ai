module.exports = {
    buildBody: function(maxEnergy) 
    {
        let body = [];

        // 4 Tough (20)
        // 20 Range (3000)
        // 8 Move (400)
        // 8 Heal (2000)

        for (let i = 0; i < 4; i++)
        {
            body.push(TOUGH);
        }
        for (let i = 0; i < 20; i++)
        {
            body.push(RANGED_ATTACK);
        }
        for (let i = 0; i < 8; i++)
        {
            body.push(MOVE);
        }
        for (let i = 0; i < 8; i++)
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
    
        let target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(target) 
        {
            //Attack Source Keeper
            if(creep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
        else
        {
            let skLairs = creep.room.find(STRUCTURE_KEEPER_LAIR);
            if(skLairs.length > 0)
            {
                skLairs.sort((a,b) => a.ticksToSpawn - b.ticksToSpawn);
                if(creep.pos.getRangeTo(skLairs[0]) > 3)
                {
                    creep.moveTo(skLairs[0]);
                }
            }    
        }
        //Always try to heal
        creep.heal(creep);
    }
};