module.exports = {
    spawnCreep: function(spawn, targetRoom) 
    {
        var body = [];

        body.push(WORK);
        body.push(CARRY);
        body.push(MOVE);
        body.push(MOVE);

        let result = spawn.createCreep(body, undefined, {role: 'fixer', targetRoom: targetRoom});
        console.log('Spawning new fixer: targetRoom(' + targetRoom + '): ' + result);
        
        return;
    },
    
    /** @param {Creep} creep **/
    run: function(creep) 
    {
        if(creep.room.name != creep.memory.targetRoom)
        {
            // find exit to target room
            let exit = creep.room.findExitTo(creep.memory.targetRoom);
            creep.moveTo(creep.pos.findClosestByRange(exit));
        }
        else
        {    
            if(creep.carry[RESOURCE_ENERGY]  == 0) 
            {
                //FILL AT CONTAINER
                let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => { 
                    return ((structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && (structure.store[RESOURCE_ENERGY] > 0))}});            
                
                if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            else
            {
                let  targets = creep.room.find(FIND_CONSTRUCTION_SITES);

                if(targets.length > 0) {
                    if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffff00'}});
                    }
                }
                else
                {
                    //Fix closest damaged structure
                    let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: object => {
                        return ((object.hits < object.hitsMax) && (object.hits < 500000))}});
                
                    if(target)
                    {
                        if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target);
                        }
                    }
                }
            }
        }
    }
};