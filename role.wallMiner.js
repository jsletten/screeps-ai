module.exports = {
    buildBody: function(maxEnergy) 
    {
        let body = [];
        let numberOfParts;

        maxEnergy = maxEnergy - 150;

        body.push(CARRY);
        body.push(CARRY);
        body.push(MOVE);
        
        numberOfParts = Math.floor(maxEnergy / 160) * 3;
        numberOfParts = Math.min(numberOfParts, 45); // limit healer size for now

        for (let i = 0; i < numberOfParts/3; i++)
        {
            body.push(WORK);
            body.push(MOVE);
        }
        for (let i = 0; i < numberOfParts/3; i++)
        {
            body.push(TOUGH);
        }

        return body;
    },    
    
    /** @param {Creep} creep **/
    run: function(creep) {
        if(_.sum(creep.carry) < creep.carryCapacity && Game.flags.attackWall && creep.getActiveBodyparts(TOUGH) > 1) 
        {
            if(Game.flags.attackWall.room != creep.room)
            {
                creep.moveTo(Game.flags.attackWall);
            }
            else
            {
                var found = Game.flags.attackWall.pos.lookFor(LOOK_STRUCTURES);
                if(found.length) 
                {
                    if(creep.dismantle(found[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(found[0]);
                    }
                    creep.say('Knock!');
                }
            }
        }
        else 
        {
            if(creep.room.name != creep.memory.homeRoom)
            {
                // find exit to target room
                var exit = creep.room.findExitTo(creep.memory.homeRoom);
                // move to exit
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
            else
            {
                target = creep.room.storage;
            
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            
            }
        }
    }
};

