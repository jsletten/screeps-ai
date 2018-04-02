module.exports = {
    spawnCreep: function(spawn) {
        let body = [];
        let role = 'linkUnloader';
        let memory = {role: role};

        body.push(CARRY);
        body.push(CARRY);
        body.push(MOVE);
       
        let newName = spawn.spawnCreep(body, 'LU-' + Game.time, {memory: memory});
        console.log('Spawning new ' + role + ': ' + newName);     

        //return {body: body, memory: memory};
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        if(_.sum(creep.carry)  == 0) {
            let link = creep.room.storage.link;

            if (link && link.energy > 0)  //Withdraw from Link
            {
                if(creep.withdraw(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(link);
                }
            }
        }
        else 
        {
            if(creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(creep.room.storage);
            }
        }
    }
};
