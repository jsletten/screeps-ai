module.exports = {
    spawnCreep: function(spawn, containerID, emergencySpawn, homeRoom = 'E32N13') 
    {
        var target = Game.getObjectById(containerID);
        var body = [];
        var maxEnergy
        var numberOfParts;

        if(emergencySpawn)
        {
            maxEnergy = 150;
        }
        else
        {
            maxEnergy = spawn.room.energyCapacityAvailable;
        }

        if(spawn.room == target.room)
        {
            //1 MOVE part for every 2 CARRY parts
            maxEnergy = Math.min(maxEnergy, 450);
            numberOfParts = Math.floor(maxEnergy / 150) * 3;
            for (let i = 0; i < ((numberOfParts/3)*2); i++) {
                body.push(CARRY);
            }
            for (let i = 0; i < (numberOfParts/3); i++) {
                body.push(MOVE);
            }
        }
        else
        {
            //1x CARRY - 1X MOVE
            numberOfParts = Math.floor(maxEnergy / 100) * 2;
            numberOfParts = Math.min(numberOfParts, 24); // limit haul capacity to 600
            for (let i = 0; i < numberOfParts/2; i++)
            {
                body.push(CARRY);
                body.push(MOVE);
            }
        }

        var result = spawn.createCreep(body, undefined, {role: 'containerHauler', containerID: containerID, homeRoom: homeRoom});
        console.log('Spawning new ContainerHauler(' + numberOfParts + '): containerID(' + containerID  + ') homeRoom(' + homeRoom + '): ' + result);
        
        return;
    },
    
    /** @param {Creep} creep **/
    run: function(creep) {
        if(_.sum(creep.carry)  == 0) {
            var target = Game.getObjectById(creep.memory.containerID);
                    
            for(resourceType in target.store) 
            {
                if(creep.withdraw(target, resourceType) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
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
                //TODO: Check if creep is only carrying energy.  Could get stuck if carrying other resource types.
                let target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (structure) => { 
                    return ((structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_TOWER || structure.structureType == STRUCTURE_LINK) && ((structure.energy < structure.energyCapacity)&&(structure.energy < 800))
                        || (structure.structureType == STRUCTURE_STORAGE))}});                  
            
                if(target)
                {
                    for(resourceType in creep.carry) 
                    {
                        if(creep.transfer(target, resourceType) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target);
                        }
                    }
                }
            }
        }
    }
};

