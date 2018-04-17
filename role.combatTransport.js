module.exports = {
    buildBody: function(maxEnergy) 
    {
        let body = [];
        let numberOfParts = Math.floor(maxEnergy / 150) * 3;
        numberOfParts = Math.min(numberOfParts, 48);

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
        if(_.sum((creep.carry) < creep.carryCapacity) && (creep.room.name != creep.memory.homeRoom))
        {
            //Find Energy to withdraw
            let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => { 
                return ((structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && _.sum(structure.store) > 0)}});            
            
            if(target)
            {
                for(resourceType in target.store) 
                {
                    if(creep.withdraw(target, resourceType) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
                    }
                }
            }
            else
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
        }
        else if(_.sum(creep.carry)  == 0) {
            if(creep.room.name == creep.memory.homeRoom && creep.ticksToLive < 100)
            {
                creep.suicide();
            }
            else
            {
                // find exit to target room
                let exit = creep.room.findExitTo(creep.memory.targetRoom);
                // move to exit
                creep.moveTo(creep.pos.findClosestByRange(exit));
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

