var Globals = require('globals');

StructureSpawn.prototype.spawnCreepsIfNecessary =
    function () 
    {
        let basicWorkers = _.filter(Game.creeps, (creep) => creep.memory.role == 'basicWorker' && creep.room == this.room);
        let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.room == this.room);
        let builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.room == this.room);
        let cleaners = _.filter(Game.creeps, (creep) => creep.memory.role == 'cleaner' && creep.room == this.room);
        let attackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker');
        let wallMiners = _.filter(Game.creeps, (creep) => creep.memory.role == 'wallMiner');
        let storageManagers = _.filter(Game.creeps, (creep) => creep.memory.role == 'storageManager' && creep.room == this.room);
        
        let hostiles = this.room.find(FIND_HOSTILE_CREEPS);
        let extractors = this.room.find(FIND_STRUCTURES, {filter: (structure) => { return (structure.structureType == STRUCTURE_EXTRACTOR) }});
        let containers = this.room.containers;
        
        // Spawn New Creeps
        if (containers.length > 0)
        {
            //TODO: Make this code more room aware.  Intent was to protect economy before adding extra roles but it isn't multi-room aware
            if(Globals.creepsByRole('containerHarvester').length >= 1 && Globals.creepsByRole('containerHauler').length >= containers.length )
            {
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
                    Globals.roles['attacker'].spawnCreep(this, this.room.name);
                }
                
                //Only spawn upgraders & builders if we've built containers and creeps to harvest&haul.
                //if(upgraders.length < this.room.controller.level) 
                //TODO: Update this code to prevent it from killing economy.
                if(this.room.storage)
                {
                    let numberOfUpgraders = Math.min(Math.floor(this.room.storage.store[RESOURCE_ENERGY] / 75000), 8);

                    if(upgraders.length < numberOfUpgraders)
                    {
                        Globals.roles['upgrader'].spawnCreep(this);
                    }
                    
                    if(storageManagers.length < 1)
                    {                        
                        Globals.roles['storageManager'].spawnCreep(this);
                    }
                }
                else
                {
                    if (upgraders.length < 2)
                    {
                        Globals.roles['upgrader'].spawnCreep(this);
                    }
                }
            }
        }
        
        if(extractors.length > 0 && extractors[0].mineral.ticksToRegeneration == undefined)
        {
            this.createHarvesters(Globals.creepsByRole('mineralHarvester', this.room.name), this.room.name, 1, false);
        }

        //Check to see if we need to spawn more haulers
        //TODO: Make this room multi-room aware.  Don't want both rooms spawning haulers for remote rooms.
        this.createHaulers(Globals.creepsByRole('containerHauler'), containers);

        //this.createHarvesters(Globals.creepsByRole('containerHarvester', this.room.name), this.room.name);
        this.createLocalHarvesters();
        


        if(this.spawning) {
            var spawningCreep = Game.creeps[this.spawning.name];
            this.room.visual.text(
                spawningCreep.memory.role,
                this.pos.x + 1,
                this.pos.y,
                {align: 'left', opacity: 0.8});
        }

    };

StructureSpawn.prototype.createLocalHarvesters =
    function()
    {
        let targetRoom = this.room.name;
        let linkHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'linkHarvester' && creep.room == this.room);
        let containerHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'containerHarvester' && creep.room == this.room);

        for(let sourceIndex in this.room.sources)
        {
            let sourceFound = false;
            let source = this.room.sources[sourceIndex];

            if(source.link)
            {
                for(let creep in linkHarvesters)
                {
                    let linkHarvester = linkHarvesters[creep];
                    if((linkHarvester.memory.targetID == source.id) && (linkHarvester.memory.targetRoom == targetRoom))
                    {
                        sourceFound = true;
                    }
                }

                if(!sourceFound)
                {
                    Globals.roles['linkHarvester'].spawnCreep(this, source.id, targetRoom, source.link.id);
                }
            }
            else
            {
                for(let creep in containerHarvesters)
                {
                    if((containerHarvesters[creep].memory.targetIndex == sourceIndex) && (containerHarvesters[creep].memory.targetRoom == targetRoom))
                    {
                        sourceFound = true;
                    }
                }

                if(!sourceFound)
                {
                    Globals.roles['containerHarvester'].spawnCreep(this, sourceIndex, false, targetRoom, harvestEnergy);
                }
            }
        }
    }

StructureSpawn.prototype.createHarvesters =
    function (harvesters, targetRoom, numberOfTargets = 2, harvestEnergy = true) 
    {
        console.log(this.name + ': CH.length('+ harvesters.length + ') targetRoom(' + targetRoom + ')');
        //Energy Sources
        for (let targetIndex = 0; targetIndex < numberOfTargets; targetIndex++) {
            let sourceFound = false;

            for(let creep in harvesters)
            {
                if((harvesters[creep].memory.targetIndex == targetIndex) && (harvesters[creep].memory.targetRoom == targetRoom))
                {
                    sourceFound = true;
                }
            }

            if(sourceFound == false)
            {
                let role = 'containerHarvester';
                if(!harvestEnergy)
                {
                    role = 'mineralHarvester';
                }
                
                Globals.roles[role].spawnCreep(this, targetIndex, false, targetRoom, harvestEnergy);
                
            }
        }
    };

StructureSpawn.prototype.createHaulers = 
    function (containerHaulers, containers)
    {
        for(var container in containers )
        {
            let extractors = containers[container].pos.findInRange(FIND_MY_STRUCTURES, 1, {filter: (structure) => { 
                return (structure.structureType == STRUCTURE_EXTRACTOR)}});
    
            //Only spawn 1 hauler for containers next to extractors.
            if(extractors.length > 0 && containers[container].creeps.length < 1)
            {
                Globals.roles['containerHauler'].spawnCreep(this, containers[container].id, (containerHaulers.length == 0), this.room.name);
            }
            else if(extractors.length == 0 && containers[container].creeps.length < 2)
            {
                //TODO: Only spawn 2nd hauler if a harvester exists for the node.
                Globals.roles['containerHauler'].spawnCreep(this, containers[container].id, (containerHaulers.length == 0), this.room.name);
            }
        }
    };

StructureSpawn.prototype.executeLinks =
    function ()
    {
        let storageLink;
        let links = this.room.storage.pos.findInRange(FIND_MY_STRUCTURES, 2, {filter: (structure) => { 
            return (structure.structureType == STRUCTURE_LINK)}});
        
        if(links.length > 0)
        {
            storageLink = links[0];
        }
        
        if(storageLink)
        {        
            let linksWithEnergy = this.room.find(FIND_MY_STRUCTURES, {filter: (structure) => { 
                return (structure.structureType == STRUCTURE_LINK) && (structure.energy > 0)}});            
              
            for(var link in linksWithEnergy)
            {
                if(linksWithEnergy[link].id != storageLink.id)
                {
                    linksWithEnergy[link].transferEnergy(storageLink);
                }
            }
        }
    };