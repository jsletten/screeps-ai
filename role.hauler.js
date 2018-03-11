var roleHauler = {

    spawnCreep: function(containerID) {
            var newName = Game.spawns['Spawn1'].createCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], undefined, {role: 'hauler', containerID: containerID.toString()});
            console.log('Spawning new hauler: ' + newName);
            return newName;
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        if(_.sum(creep.carry) == 0) {
            var target = Game.getObjectById(creep.memory.containerID)
            if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
            }
            else //Also withdraw RESOURCE_CATALYST
            {
                for(const resourceType in target.store) 
                {
                    creep.withdraw(target, resourceType);
                }
            }
        }
        else
        {
            this.refillStorage(creep);
            //this.refillSpawn(creep);
            //this.refillTower(creep);
        }
    },
    
    refillSpawn: function(creep) {
        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => { 
            return (structure.structureType == STRUCTURE_SPAWN)}});            
            
        if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    },
    
    refillTower: function(creep) {
        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => { 
            return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity}});            
            
        if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    },
    
    refillStorage: function(creep) {
        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => { 
            return (structure.structureType == STRUCTURE_STORAGE)}});            
        
        if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
        else
        {
            for(var resourceType in creep.carry) 
            {
                creep.transfer(target, resourceType);
            }
        }
    }
};

module.exports = roleHauler;