module.exports = {
    spawnCreep: function(containerID, emergencySpawn, homeRoom = 'E32N13') 
    {
        var spawn = Game.spawns['Spawn1'];
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
            numberOfParts = Math.min(numberOfParts, 50); // Can't have more then 50 parts
            for (let i = 0; i < numberOfParts/2; i++)
            {
                body.push(CARRY);
                body.push(MOVE);
            }
        }

        var result = spawn.createCreep(body, undefined, {role: 'containerHauler', containerID: containerID, homeRoom: homeRoom});
        console.log('Spawning new ContainerHauler(' + numberOfParts + '): ' + result);
        
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
                return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_TOWER || structure.structureType == STRUCTURE_LINK) && ((structure.energy < structure.energyCapacity)&&(structure.energy < 800))}});            
                
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

