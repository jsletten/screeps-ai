// This file contains the main game loop

// import modules
require('prototype.creep');
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
    
    //Declare Variables
    //TODO: Make this capabile of handling multiple spawn points.
    var spawn1 = Game.spawns['Spawn1']; // Default spawn
    
    let basicWorkers = _.filter(Game.creeps, (creep) => creep.memory.role == 'basicWorker');
    let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    let builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    let containerHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'containerHarvester');
    let containerHaulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'containerHauler');
    let cleaners = _.filter(Game.creeps, (creep) => creep.memory.role == 'cleaner');
    let attackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker');
    let claimers = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer');
    let wallMiners = _.filter(Game.creeps, (creep) => creep.memory.role == 'wallMiner');
    let hostiles = Game.spawns['Spawn1'].room.find(FIND_HOSTILE_CREEPS);
    var containers;
    var resourceNodes;
    
    if (spawn1) 
    {
        containers = spawn1.room.find(FIND_STRUCTURES, {filter: { structureType: STRUCTURE_CONTAINER }});
        resourceNodes = spawn1.room.find(FIND_SOURCES);
    }

    //Log current status
    console.log('Time:' + Game.time + ' B:' + builders.length + ' U:' + upgraders.length + ' CH:' + containerHarvesters.length);
    
    // TOWER!
    roleTower.run();

    if(hostiles.length > 10)
    {
        Game.spawns['Spawn1'].room.controller.activateSafeMode();
    }

    //Run creep logic
    for (let name in Game.creeps) 
    {
        Game.creeps[name].runRole();
    }
    
    // Spawn New Creeps
    if (containers.length > 0)
    {
        if(containerHarvesters.length == resourceNodes.length && containerHaulers.length == (containers.length * 2))
        {
            //Only spawn upgraders & builders if we've built containers and creeps to harvest&haul.
            //if(upgraders.length < Game.spawns['Spawn1'].room.controller.level) 
            //TODO: Update this code to prevent it from killing economy.
            if(upgraders.length < 2 && spawn1.room.storage.store[RESOURCE_ENERGY] > 1000)
            {
                Globals.roles['upgrader'].spawnCreep();
            }
            else if (upgraders.length < 1 && spawn1.room.storage.store[RESOURCE_ENERGY] > 500)
            {
                Globals.roles['upgrader'].spawnCreep();
            }

            if(builders.length < 1) 
            {
                let sites = Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES);
                if(sites.length > 0) 
                {
                    Globals.roles['builder'].spawnCreep();
                }
            }

            if(cleaners.length < 1)
            {
                Globals.roles['cleaner'].spawnCreep();
            }

            if(Game.flags.attackFlag && attackers.length < 5)
            {
                Globals.roles['attacker'].spawnCreep();
            }

            if(hostiles.length > 0 && attackers.length < 10)
            {
                Globals.roles['attacker'].spawnCreep();
            }

            if(Game.flags.claimFlag && claimers.length < 1)
            {
                Globals.roles['claimer'].spawnCreep();
            }

            if(Game.flags.attackWall && wallMiners.length < 3)
            {
                Globals.roles['wallMiner'].spawnCreep();
            }
        }
              
        //Check to see if we need to spawn more haulers
        if(containerHaulers.length < (containers.length * 2))
        {
            for(var container in containers )
            {
                var containerHaulerFound = 0;

                for(var creep in containerHaulers)
                {
                    if(containerHaulers[creep].memory.containerID == containers[container].id)
                    {
                        containerHaulerFound++;
                    }
                }

                //TODO: Only spawn 2nd hauler if a harvester exists for the node.
                if(containerHaulerFound < 2)
                {
                    Globals.roles['containerHauler'].spawnCreep(containers[container].id, (containerHaulers.length == 0));
                }
            }
        }
    }
    
    //Make sure we have a harvester assigned to every EnergySource
    if(resourceNodes.length > 0)
    {
        for(var node in resourceNodes )
        {
            let sourceFound = false;
            
            for(var creep in containerHarvesters)
            {
                if(containerHarvesters[creep].memory.sourceIndex == node)
                {
                    sourceFound = true;
                }
            }

            if(sourceFound == false)
            {
                Globals.roles['containerHarvester'].spawnCreep(node, (containerHarvesters.length == 0));
            }
        }
    }

    //Remote Room (mineFlag1)
    //TODO: Make this more dynamic rather then hard coding assumptions
    if(Game.flags.mineFlag1)
    {
        //Energy Sources
        for (let sourceIndex = 0; sourceIndex < 2; sourceIndex++) {
            let sourceFound = false;

            for(let creep in containerHarvesters)
            {
                if((containerHarvesters[creep].memory.sourceIndex == sourceIndex) && (containerHarvesters[creep].memory.targetRoom == Game.flags.mineFlag1.room.name))
                {
                    sourceFound = true;
                }
            }

            if(sourceFound == false)
            {
                Globals.roles['containerHarvester'].spawnCreep(sourceIndex, false, Game.flags.mineFlag1.room.name);
            }
        }
    }

    if(Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }

    
}