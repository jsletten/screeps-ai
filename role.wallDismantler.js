module.exports = {
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

        if(Game.flags.dismantleWall)
        {
            if(Game.flags.dismantleWall.room != creep.room)
            {
                creep.moveTo(Game.flags.dismantleWall);
            }
            else
            {
                let target;
                var found = Game.flags.dismantleWall.pos.lookFor(LOOK_STRUCTURES);
                if(found.length) 
                {
                    target = found[0];
                }
                else{
                    target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {filter: (structure) => structure.structureType != STRUCTURE_CONTROLLER})
                }

                if(target)
                {
                    if(creep.dismantle(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                    creep.say('Knock!');
                }
            }
        }

    }
};

