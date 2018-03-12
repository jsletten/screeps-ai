var roleContainerHauler = {
    
    spawnCreep: function(containerID, numCurrentHaulers) 
    {
        var spawn = Game.spawns['Spawn1'];
        if((spawn.room.energyCapacityAvailable >= 400) && numCurrentHaulers > 0)
        {
            var result = spawn.createCreep([CARRY,CARRY,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'containerHauler', containerID: containerID});
            console.log('Spawning new ContainerHauler(med): ' + result);
        }
        else
        {
            var result = spawn.createCreep([CARRY,CARRY,MOVE,MOVE], undefined, {role: 'containerHauler', containerID: containerID});
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
            //TODO: Make this goto Storage first, if that doesn't exist then fall back to Spawn/Extension/Tower for low level rooms.
            var target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {filter: (structure) => { 
            return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_TOWER ) && ((structure.energy < structure.energyCapacity)&&(structure.energy < 800))}});            
            
            if(target)
            {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
                }
            }
        }
    }
};

module.exports = roleContainerHauler;
