module.exports = {
    spawnCreep: function(containerID, emergencySpawn, homeRoom = 'E32N13') 
    {
        var spawn = Game.spawns['Spawn1'];
        if((spawn.room.energyCapacityAvailable >= 450) && !emergencySpawn)
        {
            var result = spawn.createCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], undefined, {role: 'containerHauler', containerID: containerID, homeRoom: homeRoom});
            console.log('Spawning new ContainerHauler(large): ' + result);
        }
        else if((spawn.room.energyCapacityAvailable >= 300) && !emergencySpawn)
        {
            var result = spawn.createCreep([CARRY,CARRY,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'containerHauler', containerID: containerID, homeRoom: homeRoom});
            console.log('Spawning new ContainerHauler(med): ' + result);
        }
        else
        {
            var result = spawn.createCreep([CARRY,CARRY,MOVE,MOVE], undefined, {role: 'containerHauler', containerID: containerID, homeRoom: homeRoom});
            console.log('Spawning new ContainerHauler(small): ' + result);
        }
        
        return;
    },
    
    /** @param {Creep} creep **/
    run: function(creep) {
        if(_.sum(creep.carry)  == 0) {

            var target = Game.getObjectById(creep.memory.containerID);
                    
            if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }

            var found = target.pos.lookFor(LOOK_ENERGY);
            if(found.length) 
            {
                var result = creep.pickup(found[0]);
                console.log('Pickup Energy: ' + result);
            }
        }
        else {
            if(creep.room.name != creep.memory.homeRoom)
            {
                // find exit to target room
                var exit = creep.room.findExitTo(creep.memory.homeRoom);
                // move to exit
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
            else
            {
                var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (structure) => { 
                return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_TOWER ) && ((structure.energy < structure.energyCapacity)&&(structure.energy < 800))}});            
                
                //If Spawn / Towers are full put remainder in storage
                if(target === 'undefined' || target === null)
                {
                    target = creep.room.storage;
                }    

                if(target)
                {
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
                    }
                }
            }
        }
    }
};

