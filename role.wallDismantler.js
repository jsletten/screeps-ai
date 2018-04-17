module.exports = {
    spawnCreep: function(spawn, homeRoom = 'E32N13') 
    {
        let body = [];
        let maxEnergy = spawn.room.energyCapacityAvailable;
        let numberOfParts;
        
        numberOfParts = Math.floor(maxEnergy / 150) * 2;
        numberOfParts = Math.min(numberOfParts, 50); 

        for (let i = 0; i < numberOfParts/2; i++)
        {
            body.push(WORK);
            body.push(MOVE);
        }


        let memory = {role: 'wallDismantler', homeRoom: homeRoom};
        let result = spawn.spawnCreep(body, 'WD-' + Game.time, {memory: memory});
        console.log('Spawning new wallDismantler(' + numberOfParts + '): ' + result);
    },

    buildBody: function(maxEnergy)
    {
        let body = [];
        let numberOfParts = Math.floor(maxEnergy / 150) * 2;
        numberOfParts = Math.min(numberOfParts, 50); 

        for (let i = 0; i < numberOfParts/2; i++)
        {
            body.push(WORK);
            body.push(MOVE);
        }

        return body;
    },
    
    /** @param {Creep} creep **/
    run: function(creep) {

        if(Game.flags.dismantleWall.room != creep.room)
        {
            creep.moveTo(Game.flags.dismantleWall);
        }
        else
        {
            var found = Game.flags.dismantleWall.pos.lookFor(LOOK_STRUCTURES);
            if(found.length) 
            {
                if(creep.dismantle(found[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(found[0]);
                }
                creep.say('Knock!');
            }
        }

    }
};

