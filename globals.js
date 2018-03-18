let attackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker');
let basicWorkers = _.filter(Game.creeps, (creep) => creep.memory.role == 'basicWorker');
let builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
let claimers = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer');
let cleaners = _.filter(Game.creeps, (creep) => creep.memory.role == 'cleaner');
let containerHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'containerHarvester');
let containerHaulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'containerHauler');
let storageManagers = _.filter(Game.creeps, (creep) => creep.memory.role == 'storageManager');
let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
let wallMiners = _.filter(Game.creeps, (creep) => creep.memory.role == 'wallMiner');



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
        attacker: attackers,
        basickWorker: basicWorkers,
        builder: builders,
        claimer: claimers,
        cleaner: cleaners,
        containerHarvester: containerHarvesters,
        containerHauler: containerHaulers,
        storageManager: storageManagers,
        upgrader: upgraders,
        wallMiner: wallMiners       
    }
};