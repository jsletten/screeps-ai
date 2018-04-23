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
        
        var terminal = creep.room.terminal;
        if(terminal.store[RESOURCE_ENERGY] < 50000) // Make sure Terminal has enough energy to trade resources
        {
            if(_.sum(creep.carry) == 0) 
            {
               var target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {filter: (structure) => ((structure.structureType == STRUCTURE_STORAGE ) && (structure.store[RESOURCE_ENERGY] > 0)) });   
                        
                if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                
            }
            else 
            {
                if(creep.transfer(terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(terminal, {visualizePathStyle: {stroke: '#ff0000'}});
                }
            }
        }
        else //Transfer 5000 of each mineral to terminal
        {
            if(_.sum(creep.carry) == 0) 
            {
                for(resourceType in creep.room.storage) 
                {
                    resourceAmount = creep.room.terminal[resourceType] || 0;
                    if(resourceAmount < 5000)
                    {
                        if(creep.withdraw(creep.room.storage, resourceType) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(creep.room.storage);
                        }
                    }
                }               
            }
            else 
            {
                for(resourceType in creep.carry) 
                {
                    if(creep.transfer(terminal, resourceType) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(terminal);
                    }
                }
            }
        }
    }
};