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
        if(creep.store[RESOURCE_ENERGY] == 0) 
        {    
            let target = creep.room.controller.link || creep.room.controller.container;
            
            if(!target)
            {
                target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => { 
                    return ((structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] >= 50)}});            
            }

            // if(!target)
            // {
            //     target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => { 
            //         return ((structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) && (structure.energy >= 50))}});            
            // }
            
            if(target)
            {
                if(creep.ticksToLive > 50)
                {
                    if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                    {
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
                let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

                if(source)
                {
                    //We need to get energy and there is a source available
                    if(creep.harvest(source) == ERR_NOT_IN_RANGE) 
                    {
                        creep.moveTo(source);
                    }
		        }
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