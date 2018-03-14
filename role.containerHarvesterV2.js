var roleContainerHarvesterV2 = {
    
    spawnCreep: function(sourceID, numCurrentHarvesters) 
    {
        var spawn = Game.spawns['Spawn1'];
        if(spawn.room.energyCapacityAvailable >= 800 && numCurrentHarvesters > 0)
        {
            var newName = spawn.createCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE], undefined, {role: 'containerHarvesterV2', sourceID: sourceID});
            console.log('Spawning new ContainerHarvester(large): ' + newName);     
        }
        else if(spawn.room.energyCapacityAvailable >= 550 && numCurrentHarvesters > 0)
        {
            var newName = spawn.createCreep([WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE], undefined, {role: 'containerHarvesterV2', sourceID: sourceID});
            console.log('Spawning new ContainerHarvester(med): ' + newName);
        }
        else
        {
            var newName = spawn.createCreep([WORK,WORK,CARRY,MOVE], undefined, {role: 'containerHarvesterV2', sourceID: sourceID});
            console.log('Spawning new ContainerHarvester(small): ' + newName);
        }
        return;
    },
    
    /** @param {Creep} creep **/
    run: function(creep, remote = false) {
        var source = Game.getObjectById(creep.memory.sourceID);
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
                creep.memory.containerID = container.ID;
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
                    var mineral = creep.pos.findClosestByRange(FIND_MINERALS);
                    
                    if(creep.pos.getRangeTo(source) < creep.pos.getRangeTo(mineral))
                    {
                        creep.harvest(source);
                        creep.transfer(container, RESOURCE_ENERGY);
                    }
                    else
                    {
                        creep.harvest(mineral);
                        for(const resourceType in creep.carry) 
                        {
                            creep.transfer(container, resourceType);
                        }
                    }
                }
            }
            else
            {
                creep.moveTo(container, {visualizePathStyle: {stroke: '#ff0000'}});
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
                    creep.moveTo(site, {visualizePathStyle: {stroke: '#ffff00'}});
                }
                creep.say('build');
                creep.build(site)
            }            
        }
    }
};

module.exports = roleContainerHarvesterV2;
