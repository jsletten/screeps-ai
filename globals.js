let attackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker');
let basicWorkers = _.filter(Game.creeps, (creep) => creep.memory.role == 'basicWorker');
let builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
let claimers = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer');

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
        storageManager: require('role.storageManager')
    },
    
    creepsByRole: function(role)
    {
        return _.filter(Game.creeps, (creep) => creep.memory.role == role);
    }
};