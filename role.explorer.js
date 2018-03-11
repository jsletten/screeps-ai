var roleExplorer = {

    spawnCreep: function(allowSpawning) {
        if(allowSpawning) {
            var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'explorer'});
            console.log('Spawning new explorer: ' + newName);  
            return newName;
        }
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        
        //var  targets = creep.room.find(FIND_CONSTRUCTION_SITES, {filter: (structure) => {return (structure.structureType == STRUCTURE_STORAGE)}});
        //if(targets.length == 0) {
        //    targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        //}
        
        var targets = [];
        
        for (site in Game.constructionSites)
        {
            targets.push(Game.constructionSites[site]);
        }
        
        if(targets.length == 0 && _.sum(creep.carry) == 0) {
      //      creep.suicide();
            return;
        }
        
        if(creep.carry[RESOURCE_ENERGY] > 0) {
            if(targets.length) {
                creep.say('🚧 build');
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffff00'}});
                }
            }
            else
            {
                var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => { 
                    return (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] < structure.storeCapacity}});            
            
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else {
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => { 
                    return (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] > 0}});            
            
            creep.say('🔄 withdraw');        
            if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
    
};

module.exports = roleExplorer;