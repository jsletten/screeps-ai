var Globals = require('globals');

StructureSpawn.prototype.spawnNextInQueue =
function ()
{
    this.room.memory.spawnQueue = this.room.memory.spawnQueue || [];
    let creepMemory = this.room.memory.spawnQueue[0];

    if(creepMemory)
    {
        console.log('Attempting to spawn new ' + creepMemory.role)
        let name = creepMemory.role + '-' + Game.time;
        let body = Globals.roles[creepMemory.role].buildBody(this.room.energyCapacityAvailable);

        let result = this.spawnCreep(body, name, {memory: creepMemory});
        if (result == OK)
        {
            console.log('Spawning ' + name);
            this.room.memory.spawnQueue.shift();
        }
    }
};

StructureSpawn.prototype.spawnCreepsIfNecessary =
    function () 
    {
        let extractors = this.room.find(FIND_STRUCTURES, {filter: (structure) => { return (structure.structureType == STRUCTURE_EXTRACTOR) }});
        let containers = this.room.containers;
        
        
        if(extractors.length > 0 && extractors[0].mineral.ticksToRegeneration == undefined)
        {
            this.createHarvesters(Globals.creepsByRole('mineralHarvester', this.room.name), this.room.name, 1, false);
        }

        //Check to see if we need to spawn more transports
        //TODO: Make this room multi-room aware.  Don't want both rooms spawning transports for remote rooms.
        //TODO: Why are we still geting 2 transports for extractors
        this.createTransports(Globals.creepsByRole('containerTransport'), containers);

        //this.createHarvesters(Globals.creepsByRole('containerHarvester', this.room.name), this.room.name);
        this.createLocalHarvesters();
        


        if(this.spawning) 
        {
            let spawningCreep = Game.creeps[this.spawning.name];
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
                    Globals.roles['containerHarvester'].spawnCreep(this, sourceIndex, false, targetRoom, true);
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

StructureSpawn.prototype.createTransports = 
    function (containerTransports, containers)
    {
        for(var container in containers )
        {
            let extractors = containers[container].pos.findInRange(FIND_MY_STRUCTURES, 1, {filter: (structure) => { 
                return (structure.structureType == STRUCTURE_EXTRACTOR)}});
    
            //Only spawn 1 transport for containers next to extractors.
            if(extractors.length > 0 && containers[container].transports.length < 1)
            {
                Globals.roles['containerTransport'].spawnCreep(this, containers[container].id, (containerTransports.length == 0), this.room.name);
            }
            else if(extractors.length == 0 && containers[container].transports.length < 2)
            {
                //TODO: Only spawn 2nd transport if a harvester exists for the node.
                Globals.roles['containerTransport'].spawnCreep(this, containers[container].id, (containerTransports.length == 0), this.room.name);
            }
        }
    };