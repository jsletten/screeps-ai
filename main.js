// This file contains the main game loop

// import modules
require('./Prototypes/prototype.creep');
require('./Prototypes/prototype.spawn');
require('./Prototypes/prototype.room');
require('./Prototypes/prototype.structure');
var Globals = require('globals');
var roleTower = require('role.tower');

// Any modules that you use that modify the game's prototypes should be require'd
// before you require the profiler.
const profiler = require('screeps-profiler');

// This line monkey patches the global prototypes.
profiler.enable();
module.exports.loop = function() 
{
  profiler.wrap(function() 
  {
    // Always place this memory cleaning code at the very top of your main loop!
    for(var name in Memory.creeps) 
    {
        if(!Game.creeps[name]) 
        {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:' + name);
        }
    }

    //Log current stats
    console.log('Time:' + Game.time + ' BM:' + Globals.creepCountByRole('baseManager') + ' CH:' + Globals.creepCountByRole('containerHarvester'));

    //TODO: Everything remote is hard coded with spawn right now, make this more dynamic
    let remoteSpawn = Game.spawns['Spawn1'];

    if(Game.flags.defendRoom)
    {
        let targetRoom = Game.flags.defendRoom.pos.roomName;
        let queuedGuardCount = remoteSpawn.room.spawnQueueCount('guard');


        if((Globals.creepCountByRole('guard', targetRoom) + queuedGuardCount) < 2)
        {
            remoteSpawn.room.addToSpawnQueue({role: 'guard', targetRoom: targetRoom});
        }
        if(Globals.creepCountByRole('healer', targetRoom) < 1)
        {
            remoteSpawn.room.addToSpawnQueue({role: 'healer', targetRoom: targetRoom});
        }
    }

    if((Game.flags.claimFlag || Game.flags.reserveFlag) && Globals.creepCountByRole('claimer') < 1)
    {
        let spawnClaimer = true;

        //TODO need to check for controller incase flag exists but no visibility to room
        if(Game.flags.reserveFlag && Game.flags.reserveFlag.room)
        {
            if(Game.flags.reserveFlag.room.controller.owner == undefined && Game.flags.reserveFlag.room.controller.reservation && Game.flags.reserveFlag.room.controller.reservation.ticksToEnd > 2000)
            {
                spawnClaimer = false;
            }
        }

        if(spawnClaimer)
        {
            remoteSpawn.room.addToSpawnQueue({role: 'claimer'});
        }
    }

    if(Game.flags.attackWall && Globals.creepCountByRole('wallMiner') < 3)
    {
        remoteSpawn.room.addToSpawnQueue({role: 'wallMiner'});

        let targetRoom = Game.flags.attackWall.pos.roomName;

        if(Globals.creepCountByRole('healer', targetRoom) < 1)
        {
            remoteSpawn.room.addToSpawnQueue({role: 'healer', targetRoom: targetRoom});
        }
    }

    let dismantleWallSpawn = Game.spawns['Spawn2'];
    if(Game.flags.dismantleWall && (Globals.creepCountByRole('wallDismantler') + dismantleWallSpawn.room.spawnQueueCount('wallDismantler') < 3))
    {
        dismantleWallSpawn.room.addToSpawnQueue({role: 'wallDismantler', homeRoom: dismantleWallSpawn.room.name});
    }

    if(Game.flags.dismantleWall && (Globals.creepCountByRole('combatTransport') + dismantleWallSpawn.room.spawnQueueCount('combatTransport') < 1))
    {
        dismantleWallSpawn.room.addToSpawnQueue({role: 'combatTransport', homeRoom: dismantleWallSpawn.room.name, targetRoom: Game.flags.dismantleWall.pos.roomName});
    }

    if(remoteSpawn)
    {
        let queuedAttackers = _.filter(remoteSpawn.room.memory.spawnQueue, (queuedCreep) => queuedCreep.role == 'attacker');
        //TODO: Fix this to add spawnCreep request to global queue instead of hard coding to one room
        if(Game.flags.attackFlag && (Globals.creepCountByRole('attacker') + queuedAttackers.length) < 5)
        {
            remoteSpawn.room.addToSpawnQueue({role: 'attacker', targetRoom: Game.flags.attackFlag.pos.roomName});
        }
    }

    if(Game.flags.tankFlag && Globals.creepCountByRole('tank') < 2)
    {
        remoteSpawn.room.addToSpawnQueue({role: 'tank', targetRoom: Game.flags.tankFlag.pos.roomName});
    }


    //Settle a new colony!
    let path = [];
    // path.push({x:12,y:43,roomName:'E32N14'});
    // path.push({x:2,y:25,roomName:'E32N15'});
    // path.push({x:47,y:24,roomName:'E31N15'});
    // path.push({x:45,y:45,roomName:'E30N15'});
    // path.push({x:30,y:45,roomName:'E30N14'});
    // path.push({x:20,y:45,roomName:'E30N13'});
    // path.push({x:10,y:45,roomName:'E30N12'});
    // path.push({x:10,y:45,roomName:'E30N11'});
    // path.push({x:10,y:45,roomName:'E30N10'});
    // path.push({x:5,y:5,roomName:'E30N9'});
    // path.push({x:20,y:15,roomName:'E29N9'});
    

    if(Game.flags.settlerFlag && (Globals.creepCountByRole('settler') + remoteSpawn.room.spawnQueueCount('settler') < 1))
    {
        remoteSpawn.room.addToSpawnQueue({role: 'settler', targetRoom: Game.flags.settlerFlag.pos.roomName, path: path, allowBuild: false})
    }

    if(Game.flags.remoteClaimFlag && (Globals.creepCountByRole('remoteClaimer') + remoteSpawn.room.spawnQueueCount('remoteClaimer') < 1))
    {
        remoteSpawn.room.addToSpawnQueue({role: 'remoteClaimer', targetRoom: Game.flags.remoteClaimFlag.pos.roomName, path: path})
    }

    // TOWER!
    roleTower.run();

    //Run creep logic
    for (let creepName in Game.creeps) 
    {
        Game.creeps[creepName].runRole();
    }

    for (let roomName in Game.rooms)
    {
        let room = Game.rooms[roomName];
        
        if(room.controller && room.controller.my)
        {      
            room.executeLinks();
            room.executeTerminal();
            room.executeLabs();
            room.executeDefenses();

            room.spawnResourceCreeps();
            room.spawnCreepsIfNecessary();
            room.spawnRemoteCreeps();
            
            room.executeSpawns();
        }
    }
  });
}