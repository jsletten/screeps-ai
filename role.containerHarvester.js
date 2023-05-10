module.exports = {   
    buildBody: function(maxEnergy) 
    {
        let body = [];
        
        //Add the single CARRY part
        body.push(CARRY);
        
        if(maxEnergy < 300)
        {
            body.push(WORK);
            body.push(MOVE);
        }
        else
        {
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
        }
        
        return body;
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        
        var target = Game.getObjectById(creep.memory.targetID);
            
        if (creep.room.name != creep.memory.targetRoom)
        {
            if(target)
            {
                creep.moveTo(target);
            }
            else
            {
                // find exit to target room
                var exit = creep.room.findExitTo(creep.memory.targetRoom);
                // move to exit
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
            
        }
        else
        {
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
                        //console.log('Harvesting: ' + creep.harvest(target));
                        if(creep.harvest(target) == OK)
                        {
                            let results = creep.pos.findInRange(FIND_MY_STRUCTURES, 1, {filter: (structure) => { 
                                return (structure.structureType == STRUCTURE_EXTENSION) && (structure.energy < structure.energyCapacity)}});

                            if(creep.carry[RESOURCE_ENERGY] > 0 && results.length > 0) 
                            {
                                creep.transfer(results[0], RESOURCE_ENERGY);
                            }
                            else
                            {
                                results = creep.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 1)

                                if(results.length > 0)
                                {
                                    creep.say('build');
                                    creep.build(results[0]);
                                }
                                else if(target.link && target.link.energy < target.link.energyCapacity)
                                {
                                    //We know it's an energy node because there is a link.
                                    creep.transfer(target.link, RESOURCE_ENERGY);
                                }
                                else
                                {
                                    for(const resourceType in creep.carry) 
                                    {
                                        creep.transfer(container, resourceType);
                                    }
                                }
                            }
                        }
                        else
                        {
                            //Move resources from container to link since we have nothing better to do.
                            if(container.store[RESOURCE_ENERGY] > 0 && target.link && target.link.energy < target.link.energyCapacity)
                            {
                                creep.withdraw(container, RESOURCE_ENERGY);
                                if(creep.carry[RESOURCE_ENERGY] > 0)
                                {
                                    creep.transfer(target.link, RESOURCE_ENERGY);
                                }
                            }
                            else
                            {
                                //Act as Cleaner
                                let resources = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);

                                if(resources) 
                                {
                                    creep.say('Resource!');
                                    creep.pickup(resources)

                                    let results = creep.pos.findInRange(FIND_MY_STRUCTURES, 1, {filter: (structure) => { 
                                        return (structure.structureType == STRUCTURE_EXTENSION) && (structure.energy < structure.energyCapacity)}});
        
                                    if(creep.carry[RESOURCE_ENERGY] > 0 && results.length > 0) 
                                    {
                                        creep.transfer(results[0], RESOURCE_ENERGY);
                                    }
                                    else
                                    {
                                        results = creep.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 1)
        
                                        if(results.length > 0)
                                        {
                                            creep.say('build');
                                            creep.build(results[0]);
                                        }
                                        else if(target.link && target.link.energy < target.link.energyCapacity)
                                        {
                                            //We know it's an energy node because there is a link.
                                            creep.transfer(target.link, RESOURCE_ENERGY);
                                        }
                                        else
                                        {
                                            for(const resourceType in creep.carry) 
                                            {
                                                creep.transfer(container, resourceType);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                else
                {
                    creep.say('Moving!');
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
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
                        if(target.harvester == creep)
                        {
                            creep.moveTo(site);
                        }
                        else
                        {
                            creep.moveTo(target);
                        }
                    }
                    creep.say('build');
                    creep.build(site);
                }            
            }
        }
    }
};
