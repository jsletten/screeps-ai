module.exports = {
    spawnCreep: function(spawn, targetID, emergencySpawn, homeRoom = 'E32N13') 
    {
        let target = Game.getObjectById(targetID);
        let memory = {role: 'containerTransport', targetID: targetID, homeRoom: homeRoom};
        let body = [];
        let maxEnergy

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
            maxEnergy = Math.min(maxEnergy, 750);
        }

        body = this.buildBody(maxEnergy);
        
        let newName = spawn.spawnCreep(body, 'CT-' + Game.time, {memory: memory});
        console.log('Spawning new ' + memory.role + '(' + maxEnergy + '): targetID(' + targetID  + ') homeRoom(' + homeRoom + '): ' + newName);
        
        //return {body: body, memory: memory};
    },

    buildBody: function(maxEnergy) 
    {
        maxEnergy = Math.min(maxEnergy, 1200);
        let body = [];
        let numberOfParts = Math.floor(maxEnergy / 150) * 3;

        //1 MOVE part for every 2 CARRY parts
        for (let i = 0; i < ((numberOfParts/3)*2); i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < (numberOfParts/3); i++) {
            body.push(MOVE);
        }
        return body;
    },
    
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.store.getUsedCapacity() == 0) {
            if(creep.room.name == creep.memory.homeRoom && creep.ticksToLive < 100)
            {
                creep.suicide();
            }

            let target = Game.getObjectById(creep.memory.targetID);
                 
            if(target && target.store.getUsedCapacity() < 100)
            {
                //Act as Cleaner
                target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);

                if(target) {
                    creep.say('Resource!');
                    if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffff00'}});
                    }
                }
                else 
                {
                    target = creep.pos.findClosestByPath(FIND_TOMBSTONES, {filter: (tombstone) => { 
                        return (tombstone.store.getUsedCapacity() > 0)}}); 
                
                    if(target)
                    {
                        for(resourceType in target.store) 
                        {
                            if(creep.withdraw(target, resourceType) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffff00'}});
                            }
                        }
                    }
                }
            }
            else if(target)
            {
                //Get resources from container
                for(resourceType in target.store) 
                {
                    if(creep.withdraw(target, resourceType) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target,{visualizePathStyle: {stroke: '#ffff00'}});
                    }
                }
            }
        }
        else {
            if(creep.room.name != creep.memory.homeRoom)
            {
                // find exit to target room
                let exit = creep.room.findExitTo(creep.memory.homeRoom);
                // move to exit
                creep.moveTo(creep.pos.findClosestByPath(exit), {visualizePathStyle: {stroke: '#ffff00'}});
            }
            else
            {
                let target;
                
                if(creep.store.getUsedCapacity() == creep.store[RESOURCE_ENERGY]) //Only energy so deposit anywhere
                {
                    //Extensions
                    if(!target)
                    {
                        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => { 
                            return ((structure.structureType == STRUCTURE_EXTENSION) && (structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0))}}); 
                    }

                    //Spawns
                    if(!target)
                    {
                        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => { 
                            return ((structure.structureType == STRUCTURE_SPAWN) && (structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0))}}); 
                    }

                    //Tower
                    if(!target)
                    {
                        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => { 
                            return ((structure.structureType == STRUCTURE_TOWER) && (structure.store.getFreeCapacity(RESOURCE_ENERGY) < creep.store.getUsedCapacity(RESOURCE_ENERGY)))}}); 
                    }

                    //Controller Container
                    if(!target)
                    {
                        let roomController = creep.room.controller;
                        if(roomController && roomController.container && !roomController.link && roomController.container.store.getFreeCapacity(RESOURCE_ENERGY) < creep.store.getUsedCapacity(RESOURCE_ENERGY))
                        {
                            target = roomController.container;
                        }
                    }                 

                    //Spawn Containers
                    if(!target)
                    {
                        let results = creep.room.spawns[0].pos.findInRange(FIND_STRUCTURES, 2, {filter: (structure) => { 
                            return (structure.structureType == STRUCTURE_CONTAINER) && (structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0)}});

                        if(results.length > 0)
                        {
                            target = creep.pos.findClosestByPath(results);
                        }    
                    }

                    //Storage under 50%
                    if(!target && creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] < creep.room.storage.store.getCapacity(RESOURCE_ENERGY)/2)
                    {
                        target = creep.room.storage;
                    }

                }
                else
                {
                    target = creep.room.storage; //Carrying resources other then energy so must deposit to storage
                }
            
                if(target)
                {
                    for(resourceType in creep.store) 
                    {
                        if(creep.transfer(target, resourceType) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffff00'}});
                        }
                    }
                }
            }
        }
    }
};

