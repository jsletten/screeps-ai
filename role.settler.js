module.exports = {
    buildBody: function(maxEnergy)
    {
        let body = [];
        maxEnergy -= 100; //reserve energy for CARRY/MOVE
        body.push(CARRY);
        body.push(CARRY);

        //2x WORK - 1x MOVE
        let numberOfParts = Math.floor(maxEnergy / 150) * 2;
        numberOfParts = Math.min(numberOfParts, 48); //creeps can't exceed 50 parts

        for (let i = 0; i < numberOfParts/2; i++)
        {
            body.push(WORK);
            body.push(MOVE);
        }

        return body;
    },

    run: function(creep) 
    {
        if(creep.memory.path.length > 0)
        {
            let nextPos = new RoomPosition(creep.memory.path[0].x, creep.memory.path[0].y, creep.memory.path[0].roomName);

            if(creep.pos.isEqualTo(nextPos))
            {
                creep.memory.path.shift();
            }
            else
            {
                creep.moveTo(nextPos);
            }  
        }
        else
        {   
            let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            let source = creep.pos.findClosestByRange(FIND_SOURCES);

            if((_.sum(creep.carry)  == 0) || (_.sum(creep.carry) < creep.carryCapacity && creep.pos.inRangeTo(source, 1)))
            {
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(source);
                }
            }  
            else
            {
                if(targets.length > 0) 
                {
                    if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) 
                    {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffff00'}});
                    }
                }
            }
        }
    }
};