module.exports = {
    roles: {
        basicWorker: require('role.basicWorker'),
        containerHarvester: require('role.containerHarvester'),
        containerTransport: require('role.containerTransport'),
        upgrader: require('role.upgrader'),
        builder: require('role.builder'),
        cleaner: require('role.cleaner'),
        claimer: require('role.claimer'),
        attacker: require('role.attacker'),
        wallMiner: require('role.wallMiner'),
        storageManager: require('role.storageManager'),
        mineralHarvester: require('role.containerHarvester'),
        healer: require('role.healer'),
        guard: require('role.guard'),
        fixer: require('role.fixer'),
        linkHarvester: require('role.linkHarvester'),
        linkUnloader: require('role.linkUnloader'),
        tank: require('role.tank'),
        settler: require('role.settler'),
        remoteClaimer: require('role.remoteClaimer'),
        wallDismantler: require('role.wallDismantler')
    },
    
    creepsByRole: function(role, targetRoom = null)
    {
        let results;
        if(targetRoom)
        {
            //console.log('creepsByRole - targetRoom:' + targetRoom);
            results = _.filter(Game.creeps, (creep) => creep.memory.role == role && creep.memory.targetRoom == targetRoom);  
        }
        else
        {
            results = _.filter(Game.creeps, (creep) => creep.memory.role == role);
        }
        return results;
    },

    creepCountByRole: function(role, targetRoom = null)
    {
        let count;
        if(targetRoom)
        {
            //console.log('creepsByRole - targetRoom:' + targetRoom);
            count = _.filter(Game.creeps, (creep) => creep.memory.role == role && creep.memory.targetRoom == targetRoom).length;  
        }
        else
        {
            count = _.filter(Game.creeps, (creep) => creep.memory.role == role).length;
        }
        return count;
    }
};