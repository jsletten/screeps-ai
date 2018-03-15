let basicWorkers = _.filter(Game.creeps, (creep) => creep.memory.role == 'basicWorker');
let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
let builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
let containerHarvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'containerHarvester');
let containerHaulers = _.filter(Game.creeps, (creep) => creep.memory.role == 'containerHauler');
let cleaners = _.filter(Game.creeps, (creep) => creep.memory.role == 'cleaner');
let attackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker');
let claimers = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer');

module.exports = {
    basicWorkers,
    upgraders,
    builders,
    containerHarvesters,
    containerHaulers,
    cleaners,
    attackers,
    claimers
};