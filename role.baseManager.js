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
            if(creep.store.getFreeCapacity() == 0)
            {
                creep.memory.gather = false;
            }
            else
            {
                //Gather Energy
                console.log('Gather Energy');
                //Mining Container (closest over 100 seems to work could sort by fullest)
                let sourceContainers = [];
                for(let sourceIndex in this.sources)
                {
                    let source = this.sources[sourceIndex];
        
                    if(source.container && !source.link && source.container.store[RESOURCE_ENERGY] > 100)
                    {
                        sourceContainers.push(source.container);
                    }
                }

                if(sourceContainers.length > 0)
                {
                    target = creep.pos.findClosestByPath(sourceContainers);
                    console.log('Gather Energy - sourceContainer');
                }

                //Storage
                if(!target && creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] > 0)
                {
                    target = creep.room.storage;
                    console.log('Gather Energy - Storage');
                }

                //Spawn Containers
                if(!target)
                {
                    let results = creep.room.spawns[0].pos.findInRange(FIND_STRUCTURES, 2, {filter: (structure) => { 
                        return (structure.structureType == STRUCTURE_CONTAINER) && (structure.store[RESOURCE_ENERGY] > 0)}});

                    if(results.length > 0)
                    {
                        target = creep.pos.findClosestByPath(results);
                        console.log('Gather Energy - Spawn Containers');
                    }  
                }

                if(target)
                {
                    console.log('Gather Energy - Target Found');
                    if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                    {
                        creep.moveTo(target, {reusePath: 10});
                    }
                }
                else
                {
                    console.log('Gather Energy - Target NOT Found');
                }
            }
        }
        else
        {
            //Deliver Energy
            console.log('Deliver Energy');
            //Extensions
            if(!target)
            {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => { 
                    return ((structure.structureType == STRUCTURE_EXTENSION) && (structure.store[RESOURCE_ENERGY] < structure.store.getCapacity()))}}); 
                console.log('Deliver Energy - Extensions');
            }
            
            //Spawns
            if(!target)
            {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => { 
                    return ((structure.structureType == STRUCTURE_SPAWN) && (structure.store[RESOURCE_ENERGY] < structure.store.getCapacity()))}}); 
                console.log('Deliver Energy - Spawns');
            }

            //Controller Container under 50%
            if(!target)
            {
                let roomController = creep.room.controller;
                if(roomController && roomController.container && !roomController.link && roomController.container.store[RESOURCE_ENERGY] < roomController.container.getCapacity()/2)
                {
                    target = roomController.container;
                    console.log('Deliver Energy - Controller Container');
                }
            }

            //Tower under 50%
            if(!target)
            {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (structure) => { 
                    return ((structure.structureType == STRUCTURE_TOWER) && (structure.store[RESOURCE_ENERGY] < structure.store.getCapacity()/2))}}); 
                console.log('Deliver Energy - Tower');
            }

            //Spawn Containers
            if(!target)
            {
                let results = creep.room.spawns[0].pos.findInRange(FIND_STRUCTURES, 2, {filter: (structure) => { 
                    return (structure.structureType == STRUCTURE_CONTAINER) && (structure.store[RESOURCE_ENERGY] < structure.store.getCapacity())}});

                if(results.length > 0)
                {
                    target = creep.pos.findClosestByPath(results);
                    console.log('Deliver Energy - Spawn Countainer');
                }    
            }

            //Storage under 50%
            if(!target && creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] < structure.store.getCapacity(RESOURCE_ENERGY)/2)
            {
                target = creep.room.storage;
                console.log('Deliver Energy - Storage');
            }

            if(target)
            {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                console.log('Deliver Energy - Target Found');
            }
            else
            {
                console.log('Deliver Energy - No Target');
                //Couldn't find a delivery target...
                //Gather if not full or HOLD it till someone needs it
                if(creep.store.getFreeCapacity() > 0)
                {
                    console.log('Deliver Energy - Try to gather');
                    creep.memory.gather = true;
                }
            }
        }
    }
};

