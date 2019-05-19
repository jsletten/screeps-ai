module.exports = {
    buildBody: function(maxEnergy)
    {
        let body = [];
        maxEnergy -= 300; //reserve energy for CARRY/MOVE
        body.push(CARRY);
        body.push(CARRY);
        body.push(CARRY);
        body.push(CARRY);
        body.push(MOVE);
        body.push(MOVE);

        //2x WORK - 1x MOVE
        let numberOfParts = Math.floor(maxEnergy / 150) * 2;
        numberOfParts = Math.min(numberOfParts, 44); //creeps can't exceed 50 parts

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
            if(Game.flags.settlerFlag)
            {
                if(creep.room == Game.flags.settlerFlag.room)
                {
                    let targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
                    let source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);

                    if(targets && source)
                    {
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
                else
                {
                    console.log('settler(' + creep.name + ') using fallback movement...')
                    creep.moveTo(Game.flags.settlerFlag);
                }
            }
        }
    }
};