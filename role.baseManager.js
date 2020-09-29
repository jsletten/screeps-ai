module.exports = {
    buildBody: function(maxEnergy) 
    {
        maxEnergy = Math.min(maxEnergy, 1500);
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
        
        


        

        let target;

        if(creep.store.getUsedCapacity() == 0 && creep.ticksToLive < 100)
        {
            creep.suicide();
        }
        else if(creep.memory.gather == true)
        {
            //Gather Energy
            //Mining Container (closest over 100 seems to work)
            //Storage
            //Spawn Container(s)



            if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {reusePath: 10});
            }
        }
        else
        {
            //Deliver Energy

            //Extensions
            if(!target)
            {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => { 
                    return ((structure.structureType == STRUCTURE_EXTENSION) && (structure.store[RESOURCE_ENERGY] < structure.store.getCapacity()))}}); 
            }
            
            //Spawns
            if(!target)
            {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => { 
                    return ((structure.structureType == STRUCTURE_SPAWN) && (structure.store[RESOURCE_ENERGY] < structure.store.getCapacity()))}}); 
            }

            //Controller Container under 50%
            if(!target)
            {
                let roomController = creep.room.controller;
                if(roomController && roomController.container && !roomController.link && roomController.container.store[RESOURCE_ENERGY] < roomController.container.getCapacity()/2)
                {
                    target = roomController.container;
                }
            }

            //Tower under 50%
            if(!target)
            {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => { 
                    return ((structure.structureType == STRUCTURE_TOWER) && (structure.store[RESOURCE_ENERGY] < structure.store.getCapacity()/2))}}); 
            }

            //Spawn Containers
            if(!target)
            {
                let results = creep.room.spawns[0].pos.findInRange(FIND_STRUCTURES, 2, {filter: (structure) => { 
                    return (structure.structureType == STRUCTURE_CONTAINER) && (structure.store[RESOURCE_ENERGY] < structure.store.getCapacity())}});

                if(results.length > 0)
                {
                    target = creep.pos.findClosestByPath(results);
                }    
            }

            //Storage under 50%
            if(!target && creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] < structure.store.getCapacity(RESOURCE_ENERGY)/2)
            {
                target = creep.room.storage;
            }

            //Gather if not full
            if(!target && creep.store.getFreeCapacity() > 0)
            {
                creep.memory.gather = true;
            }

            //Couldn't find a delivery target...
            //HOLD it till someone needs it
        }
    }
};

