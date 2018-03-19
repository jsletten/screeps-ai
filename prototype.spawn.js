var Globals = require('globals');

StructureSpawn.prototype.spawnCreepsIfNecessary =
    function () 
    {
        let basicWorkers = _.filter(Game.creeps, (creep) => creep.memory.role == 'basicWorker' && creep.room == this.room);
        let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.room == this.room);
        let builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.room == this.room);
        let cleaners = _.filter(Game.creeps, (creep) => creep.memory.role == 'cleaner' && creep.room == this.room);
        let attackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker');
        let claimers = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer');
        let wallMiners = _.filter(Game.creeps, (creep) => creep.memory.role == 'wallMiner');
        let storageManagers = _.filter(Game.creeps, (creep) => creep.memory.role == 'storageManager' && creep.room == this.room);
        
        let hostiles = this.room.find(FIND_HOSTILE_CREEPS);
        let resourceNodes = this.room.find(FIND_SOURCES);
        let containers = this.room.find(FIND_STRUCTURES, {filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER) }});
        
        // Spawn New Creeps
        if (containers.length > 0)
        {
            //TODO: Make this code more room aware.  Intent was to protect economy before adding extra roles but it isn't multi-room aware
            if(Globals.creepsByRole('containerHarvester').length >= 1 && Globals.creepsByRole('containerHauler').length >= containers.length )
            {
                //Only spawn upgraders & builders if we've built containers and creeps to harvest&haul.
                //if(upgraders.length < this.room.controller.level) 
                //TODO: Update this code to prevent it from killing economy.
                if(this.room.storage)
                {
                    if(upgraders.length < 3 && this.room.storage.store[RESOURCE_ENERGY] > 10000)
                    {
                        Globals.roles['upgrader'].spawnCreep(this);
                    }
                    else if (upgraders.length < 1 && this.room.storage.store[RESOURCE_ENERGY] > 500)
                    {
                        Globals.roles['upgrader'].spawnCreep(this);
                    }
                }
                else
                {
                    if (upgraders.length < 1)
                    {
                        Globals.roles['upgrader'].spawnCreep(this);
                    }
                }

                if(builders.length < 1) 
                {
                    let sites = this.room.find(FIND_CONSTRUCTION_SITES);
                    if(sites.length > 0) 
                    {
                        Globals.roles['builder'].spawnCreep(this, this.room.name);
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
        this.createHaulers(Globals.creepsByRole('containerHauler'), containers);

        this.createHarvesters(Globals.creepsByRole('containerHarvester'), this.room.name);
    
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
        console.log(this.name + ': CH.length('+ containerHarvesters.length + ') targetRoom(' + targetRoom + ')');
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
                Globals.roles['containerHauler'].spawnCreep(this, containers[container].id, (containerHaulers.length == 0), this.room.name);
            }
        }
    };