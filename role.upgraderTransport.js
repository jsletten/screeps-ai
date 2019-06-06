module.exports = {
    buildBody: function(maxEnergy) 
    {
        maxEnergy = Math.min(maxEnergy, 1200);
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
        if(_.sum(creep.carry)  == 0) 
        {    
            if(creep.room.name != creep.memory.homeRoom)
            {
                // find exit to target room
                let exit = creep.room.findExitTo(creep.memory.homeRoom);
                // move to exit
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
            else
            {            
                if(creep.room.name == creep.memory.homeRoom && creep.ticksToLive < 100)
                {
                    creep.suicide();
                }
                else
                {                
                    let target = Game.getObjectById(creep.memory.targetID);

                    if(target && _.sum(target.store) < 1500)
                    {

                        let source = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => { 
                            return ((structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] > 100 && structure.id != creep.memory.targetID)}});            
                        
                        // if(!source)
                        // {
                        //     source = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => { 
                        //         return ((structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) && (structure.energy > 0))}});            
                        // }

                        if(source)
                        {
                            //Withdraw from storage
                            if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(source);
                            }
                        }
                    }
                }
            }
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
};

