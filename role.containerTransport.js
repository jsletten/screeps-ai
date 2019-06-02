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
            maxEnergy = Math.min(maxEnergy, 900);
        }

        body = this.buildBody(maxEnergy);
        
        let newName = spawn.spawnCreep(body, 'CT-' + Game.time, {memory: memory});
        console.log('Spawning new ' + memory.role + '(' + maxEnergy + '): targetID(' + targetID  + ') homeRoom(' + homeRoom + '): ' + newName);
        
        //return {body: body, memory: memory};
    },

    buildBody: function(maxEnergy) 
    {
        maxEnergy = Math.min(maxEnergy, 900);
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
        if(_.sum(creep.carry)  == 0) {
            if(creep.room.name == creep.memory.homeRoom && creep.ticksToLive < 100)
            {
                creep.suicide();
            }

            let target = Game.getObjectById(creep.memory.targetID);
                 
            if(target && _.sum(target.store) < 100)
            {
                //Act as Cleaner
                target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);

                if(target) {
                    creep.say('Resource!');
                    if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
                else 
                {
                    target = creep.pos.findClosestByPath(FIND_TOMBSTONES, {filter: (tombstone) => { 
                        return (_.sum(tombstone.store) > 0)}}); 
                
                    if(target)
                    {
                        for(resourceType in target.store) 
                        {
                            if(creep.withdraw(target, resourceType) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(target);
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
                        creep.moveTo(target, {reusePath: 15});
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
                creep.moveTo(creep.pos.findClosestByRange(exit), {reusePath: 15});
            }
            else
            {
                let target;
                
                if(_.sum(creep.carry) == creep.carry[RESOURCE_ENERGY]) //Only energy so deposit anywhere
                {
                    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => { 
                        return ((structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_TOWER || structure.structureType == STRUCTURE_LINK) && ((structure.energy < structure.energyCapacity)&&(structure.energy < 800))
                            || (structure.structureType == STRUCTURE_STORAGE))}}); 

                    if(!target)
                    {
                        target = creep.room.spawns[0].pos.findInRange(FIND_STRUCTURES, 2, {filter: (structure) => { 
                            return (structure.structureType == STRUCTURE_CONTAINER) && (_.sum(structure.store) < structure.storeCapacity)}});
                    }
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

