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
            maxEnergy = Math.min(maxEnergy, 450);
        }
        else
        {
            maxEnergy = Math.min(maxEnergy, 900);
        }

        numberOfParts = Math.floor(maxEnergy / 150) * 3;

        //1 MOVE part for every 2 CARRY parts
        for (let i = 0; i < ((numberOfParts/3)*2); i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < (numberOfParts/3); i++) {
            body.push(MOVE);
        }

        var result = spawn.createCreep(body, undefined, {role: 'containerHauler', containerID: containerID, homeRoom: homeRoom});
        console.log('Spawning new ContainerHauler(' + numberOfParts + '): containerID(' + containerID  + ') homeRoom(' + homeRoom + '): ' + result);
        
        return;
    },
    
    /** @param {Creep} creep **/
    run: function(creep) {
        if(_.sum(creep.carry)  == 0) {
            let target = Game.getObjectById(creep.memory.containerID);
                    
            for(resourceType in target.store) 
            {
                if(creep.withdraw(target, resourceType) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }

            let found = target.pos.lookFor(LOOK_ENERGY);
            if(found.length) 
            {
                let result = creep.pickup(found[0]);
                console.log('Pickup Energy: ' + result);
            }
        }
        else {
            if(creep.room.name != creep.memory.homeRoom)
            {
                // find exit to target room
                let exit = creep.room.findExitTo(creep.memory.homeRoom);
                // move to exit
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
            else
            {
                let target;
                
                if(_.sum(creep.carry) == creep.carry[RESOURCE_ENERGY]) //Only energy so deposit anywhere
                {
                    target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (structure) => { 
                        return ((structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_TOWER || structure.structureType == STRUCTURE_LINK) && ((structure.energy < structure.energyCapacity)&&(structure.energy < 800))
                            || (structure.structureType == STRUCTURE_STORAGE))}}); 
                }
                else
                {
                    target = creep.room.storage; //Carrying resources other then energy so must deposit to storage
                }
            
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

