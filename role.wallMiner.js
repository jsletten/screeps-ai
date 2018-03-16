module.exports = {
    spawnCreep: function(homeRoom = 'E32N13') 
    {
        var spawn = Game.spawns['Spawn1'];
        var body = [];
        var maxEnergy
        var numberOfParts;
        //maxEnergy = spawn.room.energyCapacityAvailable - 100;

        body.push(WORK);
        body.push(WORK);
        body.push(WORK);
        body.push(WORK);
        body.push(WORK);
        body.push(WORK);

        body.push(CARRY);
        body.push(CARRY);

        body.push(MOVE);
        body.push(MOVE);
        body.push(MOVE);
        body.push(MOVE);
        body.push(MOVE);
        body.push(MOVE);
        body.push(MOVE);
        body.push(MOVE);

        var result = spawn.createCreep(body, undefined, {role: 'wallMiner', homeRoom: homeRoom});
        console.log('Spawning new WallMiner(' + numberOfParts + '): ' + result);
        
        return;
    },
    
    /** @param {Creep} creep **/
    run: function(creep) {
        if(_.sum(creep.carry) < creep.carryCapacity) {
            if(Game.flags.attackWall)
            {
                if(Game.flags.attackWall.room != creep.room)
                {
                    creep.moveTo(Game.flags.attackWall);
                }
                else
                {
                    var found = Game.flags.attackWall.pos.lookFor(LOOK_STRUCTURES);
                    if(found.length) 
                    {
                        if(creep.dismantle(found[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(found[0]);
                        }
                        creep.say('Knock!');
                    }
                }
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
                target = creep.room.storage;
            
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
                }
            
            }
        }
    }
};

