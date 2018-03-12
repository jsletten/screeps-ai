var roleContainerHarvesterV2 = {
    
    spawnCreep: function(sourceID) {
        var spawn = Game.spawns['Spawn1'];
        if(spawn.energyCapacity < 750)
        {
            var newName = spawn.createCreep([WORK,WORK,CARRY,MOVE], undefined, {role: 'containerHarvesterV2', sourceID: sourceID});
            console.log('Spawning new ContainerHarvester(small): ' + newName);     
        }
        else
        {
            var newName = spawn.createCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE], undefined, {role: 'containerHarvesterV2', sourceID: sourceID});
            console.log('Spawning new ContainerHarvester(large): ' + newName);
        }
        return;
    },
    
    /** @param {Creep} creep **/
    run: function(creep, remote = false) {
        var source = Game.getObjectById(creep.memory.sourceID);
        var container = source.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER) && (structure.pos.inRangeTo(source, 1)) }});
        
        if(container === 'undefined' || container === null)
        {
            var site = source.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES, {filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER) && (structure.pos.inRangeTo(source, 1)) }});
            if(site === 'undefined' || site === null)
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
        else
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
    }
};

module.exports = roleContainerHarvesterV2;
