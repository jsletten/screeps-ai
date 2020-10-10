module.exports = {
    spawnCreep: function(spawn, targetRoom) 
    {
        var body = [];
        var maxEnergy
        var numberOfParts = 2;

        maxEnergy = spawn.room.energyCapacityAvailable;

        //1x CARRY - 1X MOVE
        numberOfParts = Math.floor(maxEnergy / 300) * 2;
        numberOfParts = Math.min(numberOfParts, 50); // limit healer size for now
        for (let i = 0; i < numberOfParts/2; i++)
        {
            body.push(HEAL);
            body.push(MOVE);
        }

        var result = spawn.createCreep(body, undefined, {role: 'healer', targetRoom: targetRoom});
        console.log('Spawning new healer(' + numberOfParts + '): targetRoom(' + targetRoom + '): ' + result);
        
        return;
    },
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

        if(creep.heal(healTarget) == ERR_NOT_IN_RANGE) {
            moveTarget = target;
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
        else
        {
            if(moveTarget)
            {
                creep.moveTo(moveTarget);
            }
            else
            {
                creep.moveTo(25,25); //TODO make this smarter
            }
        }
    }
};