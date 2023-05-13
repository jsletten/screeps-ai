var roleBasicWorker = {
    buildBody: function(maxEnergy)
    {
        let body = [WORK,CARRY,MOVE];

        return body;
    },
    
    /** @param {Creep} creep **/
    run: function(creep) {

        if(_.sum(creep.carry) < creep.carryCapacity) {
            var source = creep.pos.findClosestByRange(FIND_SOURCES);
        
            if(source) {
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }  
        }
        else {
            var target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {filter: (structure) => { 
                return (structure.structureType == STRUCTURE_SPAWN)}});            
                
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};

module.exports = roleBasicWorker;
