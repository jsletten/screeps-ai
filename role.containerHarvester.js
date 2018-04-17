module.exports = {   
    buildBody: function(maxEnergy) 
    {
        let body = [];
        maxEnergy = Math.min(maxEnergy, 1050);
        maxEnergy = maxEnergy -50; //Account for single CARRY part.
        let numberOfParts = Math.floor(maxEnergy / 250) * 3;
        
        // make sure the creep is not too big
        numberOfParts = Math.min(numberOfParts, 48);

        //1 MOVE part for every 2 WORK parts
        for (let i = 0; i < ((numberOfParts/3)*2); i++) {
            body.push(WORK);
        }
        for (let i = 0; i < (numberOfParts/3); i++) {
            body.push(MOVE);
        }

        //Add the single CARRY part
        body.push(CARRY);
        
        return body;
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.room.name != creep.memory.targetRoom)
        {
            // find exit to target room
            var exit = creep.room.findExitTo(creep.memory.targetRoom);
            // move to exit
            creep.moveTo(creep.pos.findClosestByRange(exit));
        }
        else
        {
            var target = Game.getObjectById(creep.memory.targetID);
            var container = target.container;
            
            if(container)
            {
                if(creep.pos.isEqualTo(container.pos))
                {
                    if(creep.carry[RESOURCE_ENERGY] > 0 && container.hits < container.hitsMax)
                    {   
                        creep.say('Reapiring!');
                        creep.repair(container);
                    }
                    else
                    {
                        console.log('Harvesting: ' + creep.harvest(target));

                        for(const resourceType in creep.carry) {
                            creep.transfer(container, resourceType);
                        }
                    }
                }
                else
                {
                    creep.moveTo(container);
                }
            }
            else
            {
                var site = target.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES, {filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER) && (structure.pos.inRangeTo(target, 1)) }});
                if(!site)
                {
                    //No Container && No Construction Site
                    if(creep.pos.inRangeTo(target, 1))
                    {
                        creep.room.createConstructionSite(creep.pos, STRUCTURE_CONTAINER);
                    }
                    else
                    {
                        creep.moveTo(target);
                    }
                }
                else
                {
                    if(creep.harvest(target) == ERR_NOT_IN_RANGE) 
                    {
                        creep.moveTo(site);
                    }
                    creep.say('build');
                    creep.build(site)
                }            
            }
        }
    }
};
