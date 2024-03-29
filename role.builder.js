module.exports = {
    buildBody: function(maxEnergy)
    {
        let body = [];

        let numberOfParts =  Math.min(Math.floor(maxEnergy / 200) * 3, 48);

        for (let i = 0; i < numberOfParts/3; i++)
        {
            body.push(WORK);
            body.push(CARRY);
            body.push(MOVE);
        }

        return body;
    },

    /** @param {Creep} creep **/
    run: function(creep) {       
        if(creep.store[RESOURCE_ENERGY] > 0) {
            if (creep.room.name != creep.memory.targetRoom)
            {
                // find exit to target room
                var exit = creep.room.findExitTo(creep.memory.targetRoom);
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
            else
            {
                var  targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);

                if(targets && targets.length > 0) {
                    if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) 
                    {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffff00'}});
                    }
                }
                else
                {
                    var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => { 
                        return (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] < structure.storeCapacity}});            
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                    {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
        }
        else 
        {
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => { 
                return ((structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] > 100)}});          
                
            if(!target)
            {
                target = creep.pos.findClosestByPath(creep.room.tombstones); 
            }
            
            if(target)
            {
                if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
                }
            }
            else
            {
                let resources = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {filter: (d) => {return (d.resourceType == RESOURCE_ENERGY)}});

                if(resources && resources.length > 0) 
                {
                    creep.say('Resource!');
                    if(creep.pickup(resources[0]) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(resources[0]);
                    }
                }
            }
        }
    }
    
};
