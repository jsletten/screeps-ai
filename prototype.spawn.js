var Globals = require('globals');

StructureSpawn.prototype.spawnNextInQueue =
function ()
{
    this.room.memory.spawnQueue = this.room.memory.spawnQueue || [];
    let creepMemory = this.room.memory.spawnQueue[0];

    if(creepMemory)
    {
        let name = creepMemory.role + '-' + Game.time;
        let spawnEnergy = this.room.energyCapacityAvailable;
        if(creepMemory.role == 'storageManager' || creepMemory.role == 'containerHarvester' || creepMemory.role == 'containerTransport' || creepMemory.role == 'linkHarvester')
        {
            spawnEnergy = this.room.energyAvailable;
        }

        let body = Globals.roles[creepMemory.role].buildBody(spawnEnergy);
        let result = this.spawnCreep(body, name, {memory: creepMemory});
        console.log('Attempting to spawn new ' + creepMemory.role + ': ' + result);
        if (result == OK)
        {
            console.log('Spawning ' + name);
            this.room.memory.spawnQueue.shift();
        }
    }
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