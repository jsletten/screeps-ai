module.exports = {
    spawnCreep: function(linkID) {
        var newName = Game.spawns['Spawn1'].createCreep([CARRY,CARRY,CARRY,CARRY,MOVE,MOVE], undefined, {role: 'storageManager', linkID: linkID});
        console.log('Spawning new storageManager: ' + newName);  
        return newName;
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        if(_.sum(creep.carry)  == 0) {
            var link = Game.getObjectById(creep.memory.linkID);

            if (link.energy > 0)  //Withdraw from Link
            {
                if(creep.withdraw(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(link);
                }
            }
            else //Withdraw from Storage
            {
                if(creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.storage);
                }
            }
        }
        else 
        {
            var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (structure) => { 
                return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_TOWER ) && ((structure.energy < structure.energyCapacity)&&(structure.energy < 800))}});            
        
            if(target)
            {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            else if(creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.storage);
            }
        }
    }
};
