var roleContainerHarvester = {
    
    spawnCreep: function(containerID) {
        var spawn = Game.spawns['Spawn1'];
        if(spawn.energyCapacity < 750)
        {
            var newName = spawn.createCreep([WORK,WORK,MOVE], undefined, {role: 'containerHarvester', containerID: containerID});
            console.log('Spawning new ContainerHarvester(small): ' + newName);     
        }
        else
        {
            var newName = spawn.createCreep([WORK,WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE], undefined, {role: 'containerHarvester', containerID: containerID});
            console.log('Spawning new ContainerHarvester(large): ' + newName);
        }
        return;
    },
    
    /** @param {Creep} creep **/
    run: function(creep, remote = false) {
        var container = Game.getObjectById(creep.memory.containerID);
        
        //TODO: Make this smarter incase something is already spawning
//        if(creep.ticksToLive == 50 && remote == false)
//        {
//            this.spawnCreep(creep.containerID);
//        }

        if(creep.pos.isEqualTo(container.pos))
        {
            if(creep.carry[RESOURCE_ENERGY] > 0 && container.hits < container.hitsMax)
            {   
                creep.say('Reapiring!');
                creep.repair(container);
            }
            else
            {
                var source = creep.pos.findClosestByRange(FIND_SOURCES);
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
};

module.exports = roleContainerHarvester;
