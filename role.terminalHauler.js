var terminalHauler = {
    
    spawnCreep: function(allowSpawning) {
        if(allowSpawning) {
            var newName = Game.spawns['Spawn1'].createCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE], undefined, {role: 'terminalHauler'});
            console.log('Spawning new bigHarvester: ' + newName);
            return newName;
        }
    },
    
    /** @param {Creep} creep **/
    run: function(creep) {
        
        var terminal = creep.room.terminal;
        if(terminal.store[RESOURCE_ENERGY] < 100000) // Make sure Terminal has enough energy to trade resources
        {
            if(_.sum(creep.carry) == 0) 
            {
               var target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {filter: (structure) => ((structure.structureType == STRUCTURE_STORAGE ) && (structure.store[RESOURCE_ENERGY] > 0)) });   
                        
                if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                
            }
            else 
            {

                if(creep.transfer(terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(terminal, {visualizePathStyle: {stroke: '#ff0000'}});
                }
            }
        }
        else //Transfer minerals for sale.  Currently hard coded to RESOURCE_CATALYST
        {
            if(_.sum(creep.carry) == 0) 
            {
               var target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {filter: (structure) => ((structure.structureType == STRUCTURE_STORAGE ) && (structure.store[RESOURCE_CATALYST] > 0)) });   
                        
                if(creep.withdraw(target, RESOURCE_CATALYST) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                
            }
            else 
            {
                if(creep.transfer(terminal, RESOURCE_CATALYST) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(terminal, {visualizePathStyle: {stroke: '#ff0000'}});
                }
            }
        }
    }
};

module.exports = terminalHauler;
