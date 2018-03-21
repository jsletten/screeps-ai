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
        mineralHarvester: require('role.containerHarvester')
    },
    
    creepsByRole: function(role)
    {
        return _.filter(Game.creeps, (creep) => creep.memory.role == role);
    }
};