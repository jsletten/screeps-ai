module.exports = {
    buildBody: function(maxEnergy)
    {
        let body = [];
        maxEnergy -= 150; //reserve energy for CARRY/MOVE
        body.push(CARRY);
        body.push(CARRY);
        body.push(MOVE);

        //2x WORK - 1x MOVE
        let numberOfParts = Math.floor(maxEnergy / 250) * 3;
        numberOfParts = Math.min(numberOfParts, 45); //creeps can't exceed 50, 45 is nearest number divisible by 3 since we already have 3 static parts
        if(numberOfParts == 0)
        {
            body.push(WORK);
            body.push(MOVE);
        }
        else
        {
            for (let i = 0; i < numberOfParts/3; i++)
            {
                body.push(WORK);
                body.push(WORK);
                body.push(MOVE);
            }
        }

        return body;
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy == 0) 
        {    
            let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => { 
                return ((structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] >= 100)}});            
            
            if(!target)
            {
                target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => { 
                    return ((structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) && (structure.energy >= 50))}});            
            }
            
            if(target && (creep.ticksToLive > 50))
            {
                //creep.say('withdraw');
                if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            else
            {
                creep.suicide();
            }
        }
        else
        {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
};