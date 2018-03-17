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
    
    creepsByRole: {
        basicWorker: _.filter(Game.creeps, (creep) => creep.memory.role == 'basicWorker'),
        upgrader: _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader'),
        builder: _.filter(Game.creeps, (creep) => creep.memory.role == 'builder'),
        containerHarvester: _.filter(Game.creeps, (creep) => creep.memory.role == 'containerHarvester'),
        containerHauler: _.filter(Game.creeps, (creep) => creep.memory.role == 'containerHauler'),
        cleaner: _.filter(Game.creeps, (creep) => creep.memory.role == 'cleaner'),
        attacker: _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker'),
        claimer: _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer'),
        wallMiner: _.filter(Game.creeps, (creep) => creep.memory.role == 'wallMiner'),
        storageManager: _.filter(Game.creeps, (creep) => creep.memory.role == 'storageManager')        
    }
};