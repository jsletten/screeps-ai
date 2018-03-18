var Globals = require('globals');

StructureSpawn.prototype.spawnCreepsIfNecessary =
    function () 
    {
        let basicWorkers = _.filter(Game.creeps, (creep) => creep.memory.role == 'basicWorker');
        let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        let builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        let containerHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'containerHarvester');
        let containerHaulers = _.filter(Game.creeps, (creep) => (creep.memory.role == 'containerHauler' && creep.memory.homeRoom == this.room.name));
        let cleaners = _.filter(Game.creeps, (creep) => creep.memory.role == 'cleaner');
        let attackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker');
        let claimers = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer');
        let wallMiners = _.filter(Game.creeps, (creep) => creep.memory.role == 'wallMiner');
        let storageManagers = _.filter(Game.creeps, (creep) => creep.memory.role == 'storageManager');
        
        let hostiles = this.room.find(FIND_HOSTILE_CREEPS);
        let resourceNodes = this.room.find(FIND_SOURCES);
        let containers = this.room.find(FIND_STRUCTURES, {filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER) }});
        
        // Spawn New Creeps
        if (containers.length > 0)
        {
            if(containerHarvesters.length >= resourceNodes.length && containerHaulers.length >= (containers.length * 2))
            {
                //Only spawn upgraders & builders if we've built containers and creeps to harvest&haul.
                //if(upgraders.length < this.room.controller.level) 
                //TODO: Update this code to prevent it from killing economy.
                if(upgraders.length < 2 && this.room.storage.store[RESOURCE_ENERGY] > 1000)
                {
                    Globals.roles['upgrader'].spawnCreep(this);
                }
                else if (upgraders.length < 1 && this.room.storage.store[RESOURCE_ENERGY] > 500)
                {
                    Globals.roles['upgrader'].spawnCreep(this);
                }
    
                if(builders.length < 1) 
                {
                    let sites = this.room.find(FIND_CONSTRUCTION_SITES);
                    if(sites.length > 0) 
                    {
                        Globals.roles['builder'].spawnCreep(this);
                    }
                }
    
                if(cleaners.length < 1)
                {
                    Globals.roles['cleaner'].spawnCreep(this);
                }
    
                if(hostiles.length > 0 && attackers.length < 10)
                {
                    Globals.roles['attacker'].spawnCreep(this);
                }
            }
        }
    
        //Check to see if we need to spawn more haulers
        //TODO: Make this room multi-room aware.  Don't want both rooms spawning haulers for remote rooms.
        this.createHaulers(containerHaulers, containers);

        this.createHarvesters(containerHarvesters, this.room.name);
    
        if(this.spawning) {
            var spawningCreep = Game.creeps[this.spawning.name];
            this.room.visual.text(
                spawningCreep.memory.role,
                this.pos.x + 1,
                this.pos.y,
                {align: 'left', opacity: 0.8});
        }

    };


StructureSpawn.prototype.createHarvesters =
    function (containerHarvesters, targetRoom) 
    {
        //Energy Sources
        for (let sourceIndex = 0; sourceIndex < 2; sourceIndex++) {
            let sourceFound = false;

            for(let creep in containerHarvesters)
            {
                if((containerHarvesters[creep].memory.sourceIndex == sourceIndex) && (containerHarvesters[creep].memory.targetRoom == targetRoom))
                {
                    sourceFound = true;
                }
            }

            if(sourceFound == false)
            {
                Globals.roles['containerHarvester'].spawnCreep(this, sourceIndex, false, targetRoom);
            }
        }
    };

StructureSpawn.prototype.createHaulers = 
    function (containerHaulers, containers)
    {
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
                    Globals.roles['containerHauler'].spawnCreep(this, containers[container].id, (containerHaulers.length == 0));
                }
            }
        }
    };