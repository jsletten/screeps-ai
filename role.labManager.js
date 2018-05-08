module.exports = {
    buildBody: function(maxEnergy) 
    {
        let body = [];
        let numberOfParts;

        //1 MOVE part for every 2 CARRY parts
        maxEnergy = Math.min(maxEnergy, 600);
        numberOfParts = Math.floor(maxEnergy / 150) * 3;
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
        
        let target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {filter: (structure) => ((structure.structureType == STRUCTURE_LAB) && (structure.mineralAmount < (structure.mineralCapacity - 100)) && structure.memory.storeMineralType)});
        if(target)
        {
            if(_.sum(creep.carry)  == 0) 
            {
                if(creep.withdraw(creep.room.terminal, target.memory.storeMineralType) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.terminal);
                }
            }
            else if(creep.carry[target.memory.storeMineralType] > 0) 
            {
                if(creep.transfer(target, target.memory.storeMineralType) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            else
            {
                //Empty other resources to make room for new mineral
                for(resourceType in creep.carry) 
                {
                    if(creep.transfer(creep.room.storage, resourceType) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.storage);
                    }
                }
            }
        }
        else
        {
            target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {filter: (structure) => ((structure.structureType == STRUCTURE_LAB) && (structure.mineralAmount > 100) && structure.memory.createMineralType)});
            if(target)
            {
                if(_.sum(creep.carry)  == 0) 
                {
                    if(creep.withdraw(target, target.memory.createMineralType) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
                else if(creep.carry[target.memory.createMineralType] > 0) 
                {
                    if(creep.transfer(creep.room.storage, target.memory.createMineralType) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.storage);
                    }
                }
                else
                {
                    //Empty other resources to make room for new mineral
                    for(resourceType in creep.carry) 
                    {
                        if(creep.transfer(creep.room.storage, resourceType) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(creep.room.storage);
                        }
                    }
                }
            }
        }
        /* Fill ENERGY for LABS???
        let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => ((structure.structureType == STRUCTURE_LAB) && (structure.mineralAmount < structure.mineralCapacity))});
        
        if(_.sum(creep.carry)  == 0) {

            if(creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.storage);
            }
        }
        else 
        {
            var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (structure) => { 
                return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_TOWER ) && ((structure.energy < structure.energyCapacity)&&(structure.energy < 800))}});            
        
            if(target)
            {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            else if(creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.storage);
            }
        }
        */
    }
};
