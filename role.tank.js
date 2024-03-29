module.exports = {
    buildBody: function(maxEnergy) 
    {
        let body = [];
        let numberOfParts;

        //1x HEAL - 1X MOVE
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
        creep.heal(creep);
        
        if(creep.getActiveBodyparts(TOUGH) == 0)
        {
            if(Game.flags.rallyFlag)
            {
                creep.moveTo(Game.flags.rallyFlag);
            }
        }
        else if(creep.hits == creep.hitsMax)
        {
            if(Game.flags.tankFlag)
            {
                creep.moveTo(Game.flags.tankFlag);
            }
        }  
    }
};