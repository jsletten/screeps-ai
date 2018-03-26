module.exports = {
    spawnCreep: function(spawn) {

        let body = [];
        let maxEnergy = spawn.room.energyCapacityAvailable;
        let numberOfParts;

        //1x WORK - 1x CARRY - 1X MOVE
        numberOfParts = Math.floor(maxEnergy / 200) * 3;
        numberOfParts = Math.min(numberOfParts, 50); // creeps can't exceed 50
        for (let i = 0; i < numberOfParts/3; i++)
        {
            body.push(WORK);
            body.push(CARRY);
            body.push(MOVE);
        }

        let newName = spawn.createCreep(body, undefined, {role: 'upgrader'});
        console.log('Spawning new upgrader(' + numberOfParts + '): ' + newName);

        return;
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy == 0) 
        {    
            let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => { 
                return ((structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] > 0)}});            
            
            if(!target)
            {
                target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => { 
                    return ((structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) && (structure.energy > 0))}});            
            }
            
            if(target && (creep.ticksToLive > 50))
            {
                //creep.say('withdraw');
                if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            else
            {
                creep.suicide();
            }
        }
        else
        {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
};