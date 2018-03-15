var roles = {
    basicWorker: require('role.basicWorker'),
    containerHarvester: require('role.containerHarvester'),
    containerHauler: require('role.containerHauler'),
    upgrader: require('role.upgrader'),
    builder: require('role.builder'),
    cleaner: require('role.cleaner'),
    claimer: require('role.claimer')
};

Creep.prototype.runRole =
    function () 
    {
        roles[this.memory.role].run(this);
    };