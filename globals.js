module.exports = {
    roles: {
        basicWorker: require('role.basicWorker'),
        containerHarvester: require('role.containerHarvester'),
        containerHauler: require('role.containerHauler'),
        upgrader: require('role.upgrader'),
        builder: require('role.builder'),
        cleaner: require('role.cleaner'),
        claimer: require('role.claimer'),
        attacker: require('role.attacker'),
        wallMiner: require('role.wallMiner'),
        storageManager: require('role.storageManager'),
        mineralHarvester: require('role.containerHarvester'),
        healer: require('role.healer'),
        guard: require('role.guard')
    },
    
    creepsByRole: function(role, targetRoom = null)
    {
        let results;
        if(targetRoom)
        {
            consol.log('creepsByRole - targetRoom:' + targetRoom);
            results = _.filter(Game.creeps, (creep) => creep.memory.role == role && creep.memory.targetRoom == targetRoom);  
        }
        else
        {
            results = _.filter(Game.creeps, (creep) => creep.memory.role == role);
        }
        return results
    }
};