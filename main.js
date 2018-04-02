// This file contains the main game loop

// import modules
require('prototype.creep');
require('prototype.spawn');
require('prototype.room');
require('prototype.structure');
var Globals = require('globals');
var roleTower = require('role.tower');

module.exports.loop = function () {
    // Always place this memory cleaning code at the very top of your main loop!
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:' + name);
        }
    }
    
    //Log current stats
    console.log('Time:' + Game.time + ' H:' + Globals.creepsByRole('containerHauler').length + ' CH:' + Globals.creepsByRole('containerHarvester').length);

        //TODO: Everything remote is hard coded with spawn right now, make this more dynamic
    let remoteSpawn = Game.spawns['Spawn3'];

    
    if(Game.flags.mineFlag1)
    {
        let targetRoom = Game.flags.mineFlag1.pos.roomName;

        remoteSpawn.createHarvesters(Globals.creepsByRole('containerHarvester', targetRoom), targetRoom);

        if(Globals.creepsByRole('guard', targetRoom) < 2)
        {
            Globals.roles['guard'].spawnCreep(remoteSpawn, targetRoom)
        }

        if(Globals.creepsByRole('fixer', targetRoom) < 1)
        {
            Globals.roles['fixer'].spawnCreep(remoteSpawn, targetRoom)
        }

        if(Game.flags.mineFlag1.room)
        {       
            let containers = Game.flags.mineFlag1.room.containers;
            remoteSpawn.createHaulers(Globals.creepsByRole('containerHauler'), containers);
        }
    }
    if(Game.flags.mineFlag2)
    {
        remoteSpawn.createHarvesters(Globals.creepsByRole('containerHarvester'), Game.flags.mineFlag2.pos.roomName);

        if(Game.flags.mineFlag2.room)
        {       
            let containers = Game.flags.mineFlag2.room.containers;
            remoteSpawn.createHaulers(Globals.creepsByRole('containerHauler'), containers);
        }
    }

    if((Game.flags.claimFlag || Game.flags.reserveFlag) && Globals.creepsByRole('claimer').length < 1)
    {
        let spawnClaimer = true;

        //TODO need to check for controller incase flag exists but no visibility to room
        if(Game.flags.reserveFlag)
        {
            if(Game.flags.reserveFlag.room.controller.reservation && Game.flags.reserveFlag.room.controller.reservation.ticksToEnd > 2000)
            {
                spawnClaimer = false;
            }
        }

        if(spawnClaimer)
        {
            Globals.roles['claimer'].spawnCreep(remoteSpawn);
        }
    }

    if(Game.flags.attackWall && Globals.creepsByRole('wallMiner').length < 3)
    {
        Globals.roles['wallMiner'].spawnCreep(Game.spawns['Spawn2']);

        let targetRoom = Game.flags.attackWall.pos.roomName;

        if(Globals.creepsByRole('healer', targetRoom) < 2)
        {
            Globals.roles['healer'].spawnCreep(Game.spawns['Spawn2'], targetRoom)
        }
    }

    if(Game.flags.attackFlag && Globals.creepsByRole('attacker').length < 5)
    {
        Globals.roles['attacker'].spawnCreep(remoteSpawn, Game.flags.attackFlag.pos.roomName);
    }

    // TOWER!
    roleTower.run();

    //Run creep logic
    for (let name in Game.creeps) 
    {
        Game.creeps[name].runRole();
    }

    //Run spawn logic
    for (let name in Game.spawns)
    {
        let spawn = Game.spawns[name];
        let hostiles = spawn.room.find(FIND_HOSTILE_CREEPS);

        console.log('Spawn:' + name);
    
        Game.spawns[name].executeLinks();
        Game.spawns[name].spawnCreepsIfNecessary();

        //If more than 10 hostiles are in the room we are in trouble, activate SafeMode!
        if(hostiles.length > 10)
        {
            spawn.room.controller.activateSafeMode();
        }        
    }
}
