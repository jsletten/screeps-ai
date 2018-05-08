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
        wallDismantler: require('role.wallDismantler'),
        combatTransport: require('role.combatTransport'),
        terminalHauler: require('role.terminalHauler'),
        labManager: require('role.labManager')
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
    },

    mineralDescriptions: {
        H: {tier: 0, component1: false, component2: false },
        O: {tier: 0, component1: false, component2: false },
        U: {tier: 0, component1: false, component2: false },
        K: {tier: 0, component1: false, component2: false },
        L: {tier: 0, component1: false, component2: false },
        Z: {tier: 0, component1: false, component2: false },
        G: {tier: 2, component1: "ZK", component2: "UL" },
        X: {tier: 0, component1: false, component2: false },
        OH: {tier: 1, component1: "O", component2: "H" },
        UH: {tier: 1, component1: "U", component2: "H", bodyPart: ATTACK},
        UO: {tier: 1, component1: "U", component2: "O", bodyPart: WORK},
        UL: {tier: 1, component1: "U", component2: "L" },
        KH: {tier: 1, component1: "K", component2: "H", bodyPart: CARRY},
        KO: {tier: 1, component1: "K", component2: "O", bodyPart:RANGED_ATTACK},
        LH: {tier: 1, component1: "L", component2: "H", bodyPart: WORK },
        LO: {tier: 1, component1: "L", component2: "O", bodyPart: HEAL },
        ZH: {tier: 1, component1: "Z", component2: "H", bodyPart: WORK },
        ZO: {tier: 1, component1: "Z", component2: "O", bodyPart: MOVE },
        ZK: {tier: 1, component1: "Z", component2: "K" },
        GH: {tier: 1, component1: "G", component2: "H", bodyPart: WORK },
        GO: {tier: 1, component1: "G", component2: "O", bodyPart: TOUGH },
        UH2O: {tier: 2, component1: "UH", component2: "OH", bodyPart: ATTACK },
        UHO2: {tier: 2, component1: "UO", component2: "OH", bodyPart: WORK },
        KH2O: {tier: 2, component1: "KH", component2: "OH", bodyPart: CARRY },
        KHO2: {tier: 2, component1: "KO", component2: "OH", bodyPart: RANGED_ATTACK },
        LH2O: {tier: 2, component1: "LH", component2: "OH", bodyPart: WORK },
        LHO2: {tier: 2, component1: "LO", component2: "OH", bodyPart: HEAL },
        ZH2O: {tier: 2, component1: "ZH", component2: "OH", bodyPart: WORK },
        ZHO2: {tier: 2, component1: "ZO", component2: "OH", bodyPart: MOVE },
        GH2O: {tier: 2, component1: "GH", component2: "OH", bodyPart: WORK },
        GHO2: {tier: 2, component1: "GO", component2: "OH", bodyPart: TOUGH },
        XUH2O: {tier: 3, component1: "X", component2: "UH2O", bodyPart: ATTACK },
        XUHO2: {tier: 3, component1: "X", component2: "UHO2", bodyPart: WORK },
        XKH2O: {tier: 3, component1: "X", component2: "KH2O", bodyPart: CARRY },
        XKHO2: {tier: 3, component1: "X", component2: "KHO2", bodyPart: RANGED_ATTACK },
        XLH2O: {tier: 3, component1: "X", component2: "LH2O", bodyPart: WORK },
        XLHO2: {tier: 3, component1: "X", component2: "LHO2", bodyPart: HEAL },
        XZH2O: {tier: 3, component1: "X", component2: "ZH2O", bodyPart: WORK },
        XZHO2: {tier: 3, component1: "X", component2: "ZHO2", bodyPart: MOVE },
        XGH2O: {tier: 3, component1: "X", component2: "GH2O", bodyPart: WORK },
        XGHO2: {tier: 3, component1: "X", component2: "GHO2", bodyPart: TOUGH }
    }
};