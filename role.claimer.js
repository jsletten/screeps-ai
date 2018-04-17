var roleClaimer = {
    
    spawnCreep: function(spawn) 
    {
        let body = [];
        let maxEnergy = spawn.room.energyCapacityAvailable;
        //1x CLAIM - 1X MOVE
        let numberOfParts = Math.floor(maxEnergy /650) * 2;

        for (let i = 0; i < numberOfParts/2; i++)
        {
            body.push(CLAIM);
            body.push(MOVE);
        }

        spawn.createCreep(body, undefined, {role: 'claimer'});
        console.log('Spawning new Claimer(' + numberOfParts + ')');
        return;
    },

    buildBody: function(maxEnergy)
    {
        let body = [];
        let numberOfParts = Math.floor(maxEnergy /650) * 2;
        numberOfParts = Math.min(numberOfParts, 50);

        for (let i = 0; i < numberOfParts/2; i++)
        {
            body.push(CLAIM);
            body.push(MOVE);
        }

        return body;
    },
    
    /** @param {Creep} creep **/
    run: function(creep) 
    {
        if(Game.flags.reserveFlag)
        {
            if(creep.room == Game.flags.reserveFlag.room)
            {
                console.log('Controller.owner:' + creep.room.controller.owner);
                if(creep.room.controller.owner == undefined)
                {
                    if(creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }
                else if(!creep.room.controller.my) {
                    if(creep.attackController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }
            }
            else
            {
                creep.moveTo(Game.flags.reserveFlag);
            }
        }
        if(Game.flags.claimFlag)
        {
            if(creep.room == Game.flags.claimFlag.room)
            {
                console.log('Controller.owner:' + creep.room.controller.owner);
                if(creep.room.controller.owner == undefined)
                {
                    if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }
                else if(!creep.room.controller.my) {
                    if(creep.attackController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }
            }
            else
            {
                creep.moveTo(Game.flags.claimFlag);
            }
        }
    }
};

module.exports = roleClaimer;
