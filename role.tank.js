module.exports = {
    spawnCreep: function(spawn, targetRoom) 
    {
        var body = [];
        var maxEnergy
        var numberOfParts;

        maxEnergy = spawn.room.energyCapacityAvailable;

        //1x HEAL - 1X MOVE
        numberOfParts = Math.floor(maxEnergy / 300) * 2;
        //numberOfParts = Math.min(numberOfParts, 4); // limit healer size for now
        for (let i = 0; i < numberOfParts/2; i++)
        {
            body.push(HEAL);
            body.push(MOVE);
        }

        let memory = {role: 'tank', targetRoom: targetRoom};
        let result = spawn.spawnCreep(body, 'TK-' + Game.time, {memory: memory});
        console.log('Spawning new Tank(' + numberOfParts + '): targetRoom(' + targetRoom + '): ' + result);
        
        //return {name: result, body: body, memory: memory};
    },
    
    /** @param {Creep} creep **/
    run: function(creep) 
    {            
        creep.heal(creep);
        
        if(Game.flags.tankFlag)
        {
            creep.moveTo(Game.flags.tankFlag);
        }
    }
};