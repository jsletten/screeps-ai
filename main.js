// This file contains the main game loop

// import modules
require('prototype.creep');
require('prototype.spawn')
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

        //TODO: Everything remote is hard coded with spawn1 right now, make this more dynamic
    let spawn1 = Game.spawns['Spawn1'];

    //TODO: This is a room one only feature, need to figure out how to set the "storageLink" for earch room and put this code inside the room loop / structureSpawn as appropriate
    let storageLink = Game.getObjectById('5aab7f20bee66f0ce744f802');
    if(storageLink)
    {
        if(Globals.creepsByRole('storageManager').length < 1)
        {
            Globals.roles['storageManager'].spawnCreep(spawn1, storageLink.id);
        }
        
        let linksWithEnergy = spawn1.room.find(FIND_MY_STRUCTURES, {filter: (structure) => { 
            return (structure.structureType == STRUCTURE_LINK) && (structure.energy > 0)}});            
          
        for(var link in linksWithEnergy)
        {
            if(linksWithEnergy[link].id != storageLink.id)
            {
                linksWithEnergy[link].transferEnergy(storageLink);
            }
        }
    }
    
    if(Game.flags.mineFlag1)
    {
        spawn1.createHarvesters(Globals.creepsByRole('containerHarvester'), Game.flags.mineFlag1.pos.roomName);

        if(Game.flags.mineFlag1.room)
        {       
            let containers = Game.flags.mineFlag1.room.find(FIND_STRUCTURES, {filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER) }});
            spawn1.createHaulers(Globals.creepsByRole('containerHauler'), containers);
        }
    }
    if(Game.flags.mineFlag2)
    {
        spawn1.createHarvesters(Globals.creepsByRole('containerHarvester'), Game.flags.mineFlag2.pos.roomName);

        if(Game.flags.mineFlag2.room)
        {       
            let containers = Game.flags.mineFlag2.room.find(FIND_STRUCTURES, {filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER) }});
            spawn1.createHaulers(Globals.creepsByRole('containerHauler'), containers);
        }
    }

    if((Game.flags.claimFlag || Game.flags.reserveFlag) && Globals.creepsByRole('claimer').length < 1)
    {
        Globals.roles['claimer'].spawnCreep(spawn1);
    }

    if(Game.flags.attackWall && Globals.creepsByRole('wallMiner').length < 3)
    {
        Globals.roles['wallMiner'].spawnCreep(spawn1);
    }

    if(Game.flags.attackFlag && Globals.creepsByRole('attacker').length < 5)
    {
        Globals.roles['attacker'].spawnCreep(spawn1, attackFlag.pos.roomName);
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
        var spawn = Game.spawns[name];
        let hostiles = spawn.room.find(FIND_HOSTILE_CREEPS);

        console.log('Spawn:' + name);
    
        Game.spawns[name].spawnCreepsIfNecessary();

        //If more than 10 hostiles are in the room we are in trouble, activate SafeMode!
        if(hostiles.length > 10)
        {
            spawn.room.controller.activateSafeMode();
        }        
    }
}
