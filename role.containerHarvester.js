module.exports = {
    spawnCreep: function(sourceIndex, emergencySpawn, targetRoom = 'E32N13') 
    {
        var spawn = Game.spawns['Spawn1'];
        var body = [];
        var maxEnergy = spawn.room.energyCapacityAvailable - 50;
        var numberOfParts = Math.floor(maxEnergy / 250) * 3;

        if(emergencySpawn)
        {
            numberOfParts = 3;
        }

        // make sure the creep is not too big (more than 50 parts)
        numberOfParts = Math.min(numberOfParts, 49);

        //1 MOVE part for every 2 WORK parts
        for (let i = 0; i < Math.min(((numberOfParts/3)*2), 6); i++) {
            body.push(WORK);
        }
        for (let i = 0; i < Math.min((numberOfParts/3), 6); i++) {
            body.push(MOVE);
        }

        //Add the single CARRY part
        body.push(CARRY);

        var newName = spawn.createCreep(body, undefined, {role: 'containerHarvester', sourceIndex: sourceIndex, targetRoom: targetRoom});
        console.log('Spawning new ContainerHarvester(' + numberOfParts + '): ' + newName);     
        
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
            var source = creep.room.find(FIND_SOURCES)[creep.memory.sourceIndex];
            var container;

            if(creep.memory.containerID)
            {
                container = Game.getObjectById(creep.memory.containerID);
            }
            else
            {
                container = source.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER) && (structure.pos.inRangeTo(source, 1)) }});
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
                        creep.harvest(source);
                        creep.transfer(container, RESOURCE_ENERGY);
                    }
                }
                else
                {
                    creep.moveTo(container);
                }
            }
            else
            {
                var site = source.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES, {filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER) && (structure.pos.inRangeTo(source, 1)) }});
                if(!site)
                {
                    //No Container && No Construction Site
                    if(creep.pos.inRangeTo(source, 1))
                    {
                        creep.room.createConstructionSite(creep.pos, STRUCTURE_CONTAINER);
                    }
                    else
                    {
                        creep.moveTo(source);
                    }
                }
                else
                {
                    if(creep.harvest(source) == ERR_NOT_IN_RANGE) 
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
