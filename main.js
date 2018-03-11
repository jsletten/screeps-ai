// This file contains the main game loop
const allowSpawning = false; // Quick way to shut down creep spawning if something goes wrong.

// Setup specific AI roles.
var roleBasicWorker = require('role.basicWorker');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleHauler = require('role.hauler');
var roleBigHarvester = require('role.bigHarvester');
var roleTower = require('role.tower');
var roleContainerHarvester = require('role.containerHarvester');
var roleCleaner = require('role.cleaner');
var roleTerminalHauler = require('role.terminalHauler');

module.exports.loop = function () {
    // Always place this memory cleaning code at the very top of your main loop!
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:' + name);
        }
    }
    
    //Declare Variables
    //TODO: Make this capabile of handling multiple spawn points.
    var spawn1 = Game.spawns['Spawn1']; // Default spawn
    
    var basicWorkers = _.filter(Game.creeps, (creep) => creep.memory.role == 'basicWorker');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var haulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'hauler');
    var bigHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'bigHarvester');
    var containerHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'containerHarvester');
    var cleaners = _.filter(Game.creeps, (creep) => creep.memory.role == 'cleaner');
    var terminalHaulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'terminalHauler');
    
    var containers;
    
    if (typeof spawn1 !== 'undefined') {
        containers = spawn1.room.find(FIND_STRUCTURES, {filter: { structureType: STRUCTURE_CONTAINER }});
    }

    //Log current status
    console.log('Time:' + Game.time + ' B:' + builders.length + ' U:' + upgraders.length + ' BH:' + bigHarvesters.length  + ' L:' + haulers.length + ' CH:' + containerHarvesters.length);
    
    // TOWER!
    roleTower.run();
    
    // Spawn New Creeps
    /*
    if(cleaners.length <1) {
        roleCleaner.spawnCreep(allowSpawning);
    }
    
    if(upgraders.length < 2) {
        roleUpgrader.spawnCreep('59296a59252e7c1c46120a4a');
    }
    
    if(terminalHaulers.length < 1)
    {
        roleTerminalHauler.spawnCreep(allowSpawning);
    }
    
    if(builders.length < 2) {
        var sites = Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES);
        if(sites.length > 0) {
            roleBuilder.spawnCreep(allowSpawning);
        }
    }
    
    if(haulers.length < (containers.length + 1)) {
        for(var container in containers)
        {
            var timesContainerFound = 0
            
            for(var creep in haulers)
            {
                if(haulers[creep].memory.containerID == containers[container].id)
                {
                    timesContainerFound++;
                }
            }
            
            if(Game.spawns['Spawn1'].pos.getRangeTo(containers[container].pos) > 20)
            {
                timesContainerFound--; //Reduce the count so an extra hauler will go to container greater than range 20
            }
            if(timesContainerFound < 1 )
            {
                roleHauler.spawnCreep(containers[container].id);
            }
        }
    }
    
    if(bigHarvesters.length < 2) {
       roleBigHarvester.spawnCreep(allowSpawning);
    }
  
    if(containerHarvesters.length < containers.length)
    {
        for(var container in containers )
        {
            var containerFound = false
            
            for(var creep in containerHarvesters)
            {
                if(containerHarvesters[creep].memory.containerID == containers[container].id)
                {
                    containerFound = true;
                }
            }
            
            if(containerFound == false)
            {
                roleContainerHarvester.spawnCreep(containers[container].id);
            }
        }
    }
    */
   if(basicWorkers.length <2) {
    roleBasicWorker.spawnCreep();
    }


    if(Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }


    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'basicWorker') {
            roleBasicWorker.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
            //roleContainerHarvester.run(creep);
            //creep.moveTo(30,20)
        }
        if(creep.memory.role == 'hauler') {
            roleHauler.run(creep);
        }
        if(creep.memory.role == 'terminalHauler')
        {
            roleTerminalHauler.run(creep);
        }
        if(creep.memory.role == 'bigHarvester') {
            roleBigHarvester.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'containerHarvester')
        {
            roleContainerHarvester.run(creep);
        }
        if(creep.memory.role == 'cleaner') {
            roleCleaner.run(creep);
        }
    }
}