// This file contains the main game loop

// import modules
require('prototype.creep');
var roleTower = require('role.tower');

var roles = {
    basicWorker: require('role.basicWorker'),
    containerHarvester: require('role.containerHarvester'),
    containerHauler: require('role.containerHauler'),
    upgrader: require('role.upgrader'),
    builder: require('role.builder'),
    cleaner: require('role.cleaner'),
    claimer: require('role.claimer'),
    attacker: require('role.attacker')
};

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
    var containerHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'containerHarvester');
    var containerHaulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'containerHauler');
    var cleaners = _.filter(Game.creeps, (creep) => creep.memory.role == 'cleaner');
    var attackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker');
    var claimers = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer');
    
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
    
    // Spawn New Creeps
    
    if (containers.length > 0)
    {
        if(containerHarvesters.length == resourceNodes.length && containerHaulers.length == (containers.length * 2))
        {
            //Only spawn upgraders & builders if we've built containers and creeps to harvest&haul.
            //if(upgraders.length < Game.spawns['Spawn1'].room.controller.level) 
            //TODO: Update this code to prevent it from killing economy.
            if(upgraders.length < 2)
            {
                roles['upgrader'].spawnCreep();
            }

            if(builders.length < 1) 
            {
                let sites = Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES);
                if(sites.length > 0) 
                {
                    roles['builder'].spawnCreep();
                }
            }

            if(cleaners.length < 1)
            {
                roles['cleaner'].spawnCreep();
            }

            if(Game.flags.attackFlag && attackers.length < 5)
            {
                roles['attacker'].spawnCreep();
            }

            if(Game.flags.claimFlag && claimers.length < 1)
            {
                roles['claimer'].spawnCreep();
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
                    roles['containerHauler'].spawnCreep(containers[container].id, (containerHaulers.length == 0));
                }
            }
        }
    }
    
    //Make sure we have a harvester assigned to every EnergySource
    if(resourceNodes.length > 0)
    {
        for(var node in resourceNodes )
        {
            var sourceFound = false;
            
            for(var creep in containerHarvesters)
            {
                if(containerHarvesters[creep].memory.sourceID == resourceNodes[node].id)
                {
                    sourceFound = true;
                }
            }

            if(sourceFound == false)
            {
                roles['containerHarvester'].spawnCreep(resourceNodes[node].id, (containerHarvesters.length == 0));
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

    //Run creep logic
    for (let name in Game.creeps) 
    {
        Game.creeps[name].runRole();
    }
}