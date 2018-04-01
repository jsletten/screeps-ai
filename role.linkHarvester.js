module.exports = {
    spawnCreep: function(spawn, targetID, targetRoom, linkID, emergencySpawn = false) 
    {
        let body = [];
        let role = 'linkHarvester';
        let memory = {role: role, targetID: targetID, targetRoom: targetRoom, linkID: linkID};

        if(emergencySpawn)
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

        let newName = spawn.spawnCreep(body, 'LH-' + Game.time, {memory: memory});
        console.log('Spawning new ' + role + ' target: ' + targetRoom + '(' + targetID + '): ' + newName);     

        //return {body: body, memory: memory};
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
            let link = Game.getObjectById(creep.memory.linkID);;
            
            if(creep.harvest(target) == ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(target);
            }

            creep.transfer(link, RESOURCE_ENERGY);        
        }
    }
};