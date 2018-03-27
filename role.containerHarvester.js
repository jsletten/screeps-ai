module.exports = {
    spawnCreep: function(spawn, targetIndex, emergencySpawn, targetRoom = 'E32N13', harvestEnergy = true) 
    {
        var body = [];
        var maxEnergy = spawn.room.energyCapacityAvailable - 50;
        var numberOfParts = Math.floor(maxEnergy / 250) * 3;
        var role = 'containerHarvester';

        if(emergencySpawn)
        {
            numberOfParts = 3;
        }

        if(harvestEnergy)
        {
            //Energy Harvesters don't need more then 6 WORK parts to keep up with node respawn.
            numberOfParts = Math.min(numberOfParts, 9);
        }
        else
        {
            role = 'mineralHarvester';
            // make sure the creep is not too big (more than 50 parts))
            numberOfParts = Math.min(numberOfParts, 49);
        }        

        //1 MOVE part for every 2 WORK parts
        for (let i = 0; i < ((numberOfParts/3)*2); i++) {
            body.push(WORK);
        }
        for (let i = 0; i < (numberOfParts/3); i++) {
            body.push(MOVE);
        }

        //Add the single CARRY part
        body.push(CARRY);

        var newName = spawn.createCreep(body, undefined, {role: role, targetIndex: targetIndex, targetRoom: targetRoom});
        console.log('Spawning new ' + role + '(' + numberOfParts + ') target: ' + targetRoom + '(' + targetIndex + '): ' + newName);     
        
        return;
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
            var target;
            var container;

            if(creep.memory.role == 'containerHarvester')
            {
                target = creep.room.find(FIND_SOURCES)[creep.memory.targetIndex];
            }
            else
            {
                target = creep.room.find(FIND_MINERALS)[creep.memory.targetIndex];
            }

            if(creep.memory.containerID)
            {
                container = Game.getObjectById(creep.memory.containerID);
            }
            else
            {
                container = target.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER) && (structure.pos.inRangeTo(target, 1)) }});
                if(container) 
                {
                    creep.memory.containerID = container.id;
                }
            }
            
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
                        creep.harvest(target);

                        for(const resourceType in creep.carry) {
                            creep.transfer(container, resourceType);
                        }

                        let links = creep.pos.findInRange(FIND_MY_STRUCTURES, 1, {filter: (structure) => { 
                            return ((structure.structureType == STRUCTURE_LINK) && (structure.energy < structure.energyCapacity)) }});
                        
                        if(links.length > 0)
                        {
                            creep.transfer(links[0], RESOURCE_ENERGY);
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
