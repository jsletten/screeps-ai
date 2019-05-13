module.exports = {
    buildBody: function(maxEnergy) 
    {
        maxEnergy = Math.min(maxEnergy, 900);
        let body = [];
        let numberOfParts = Math.floor(maxEnergy / 150) * 3;

        //1 MOVE part for every 2 CARRY parts
        for (let i = 0; i < ((numberOfParts/3)*2); i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < (numberOfParts/3); i++) {
            body.push(MOVE);
        }
        return body;
    },
    
    /** @param {Creep} creep **/
    run: function(creep) {
        if(_.sum(creep.carry)  == 0) {
            if(creep.room.name == creep.memory.homeRoom && creep.ticksToLive < 100)
            {
                creep.suicide();
            }
            else
            {
                //Withdraw from storage
                if(creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.storage);
                }
            }
        }
        else {
            if(creep.room.name != creep.memory.homeRoom)
            {
                // find exit to target room
                let exit = creep.room.findExitTo(creep.memory.homeRoom);
                // move to exit
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
            else
            {
                let target = Game.getObjectById(creep.memory.targetID);
                 
                if(target)
                {
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
            }
        }
    }
};

