Object.defineProperty(Game, 'roles', {
    get: function() {
        let roleList = {
            basicWorker: require('role.basicWorker'),
            containerHarvester: require('role.containerHarvester'),
            containerHauler: require('role.containerHauler'),
            upgrader: require('role.upgrader'),
            builder: require('role.builder'),
            cleaner: require('role.cleaner'),
            claimer: require('role.claimer'),
            attacker: require('role.attacker')
        };
        return roleList;
    },
    // This makes it so the property doesn't show up when enumerating the properties 
    // of the creep. If you arent sure, put false.
    enumerable: false,
    // This makes the characteristics of the property modifiable and also makes 
    // the property deletable. if you arent sure, put true.
    configurable: true
   });
