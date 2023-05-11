Object.defineProperty(StructureContainer.prototype, 'transports', {
    get: function() {
        if (!this._transports) {          
            this._transports = _.filter(Game.creeps, (creep) => (creep.memory.role == 'containerTransport' || creep.memory.role == 'baseManager') && creep.memory.targetID == this.id);
        }
        return this._transports || [];
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(StructureContainer.prototype, 'hasEnergy', {
    get: function() {
        if (!this._hasEnergy) {          
            this._hasEnergy = this.store[RESOURCE_ENERGY] > 0;
        }
        return this._hasEnergy;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(StructureContainer.prototype, 'hasResource', {
    get: function() {
        if (!this._hasResource) {          
            this._hasResource = _.sum(this.store) > 0;
        }
        return this._hasResource;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(StructureLink.prototype, 'harvester', {
    get: function() {
        if (!this._linkHarvester) {        
            let results = _.filter(Game.creeps, (creep) => creep.memory.role == 'linkHarvester' && creep.memory.targetID == this.id);
            if(results.length > 0)
            {
                this._linkHarvester = results[0];
            }
        }
        return this._linkHarvester;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(StructureStorage.prototype, 'link', {
    get: function() {
        if (!this._link) {
            let results = this.pos.findInRange(FIND_MY_STRUCTURES, 2, {filter: (structure) => { 
                return (structure.structureType == STRUCTURE_LINK) }});
            if(results.length > 0)
            {
                this._link = results[0];
            }
        }
        return this._link;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Source.prototype, 'link', {
    get: function() {
        if (!this._link) {
            let results = this.pos.findInRange(FIND_MY_STRUCTURES, 2, {filter: (structure) => { 
                return (structure.structureType == STRUCTURE_LINK) }});
            if(results.length > 0)
            {
                this._link = results[0];
            }
        }
        return this._link;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Source.prototype, 'container', {
    get: function() {
        if (!this._container) {
            let results = this.pos.findInRange(FIND_STRUCTURES, 1, {filter: (structure) => { 
                return (structure.structureType == STRUCTURE_CONTAINER) }});
            if(results.length > 0)
            {
                this._container = results[0];
            }
        }
        return this._container;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Source.prototype, 'harvester', {
    get: function() {
        if (!this._harvester) {        
            let results = _.filter(Game.creeps, (creep) => (creep.memory.role == 'containerHarvester' || creep.memory.role == 'linkHarvester') && creep.memory.targetID == this.id);
            if(results.length > 0)
            {
                this._harvester = results[0];
            }
        }
        return this._harvester;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Mineral.prototype, 'harvester', {
    get: function() {
        if (!this._harvester) {        
            let results = _.filter(Game.creeps, (creep) => creep.memory.role == 'mineralHarvester' && creep.memory.targetID == this.id);
            if(results.length > 0)
            {
                this._harvester = results[0];
            }
        }
        return this._harvester;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Mineral.prototype, 'extractor', {
    get: function() {
        if (!this._extractor) {
            let results = this.pos.lookFor(LOOK_STRUCTURES);
            if(results.length > 0)
            {
                this._extractor = results[0];
            }
        }
        return this._extractor;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Mineral.prototype, 'container', {
    get: function() {
        if (!this._container) {
            let results = this.pos.findInRange(FIND_STRUCTURES, 1, {filter: (structure) => { 
                return (structure.structureType == STRUCTURE_CONTAINER) }});
            if(results.length > 0)
            {
                this._container = results[0];
            }
        }
        return this._container;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(StructureExtractor.prototype, 'mineral', {
    get: function() {
        if (!this._mineral) {
            let results = this.pos.lookFor(LOOK_MINERALS);
            if(results.length > 0)
            {
                this._mineral = results[0];
            }
        }
        return this._mineral;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(StructureLab.prototype, 'memory', {
    configurable: true,
    get: function() {
        if(_.isUndefined(Memory.myLabsMemory)) {
            Memory.myLabsMemory = {};
        }
        if(!_.isObject(Memory.myLabsMemory)) {
            return undefined;
        }
        return Memory.myLabsMemory[this.id] = 
                Memory.myLabsMemory[this.id] || {};
    },
    set: function(value) {
        if(_.isUndefined(Memory.myLabsMemory)) {
            Memory.myLabsMemory = {};
        }
        if(!_.isObject(Memory.myLabsMemory)) {
            throw new Error('Could not set source memory');
        }
        Memory.myLabsMemory[this.id] = value;
    }
});

Object.defineProperty(StructureLab.prototype, 'createMineralType', {
    get: function() 
    {
        if (!this._createMineralType) 
        {
            if (!this.memory.createMineralType) 
            {
                this._createMineralType = undefined;
            }
            else
            {
                this._createMineralType = this.memory.createMineralType;
            }
        }
        
        return this._createMineralType;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(StructureLab.prototype, 'storeMineralType', {
    get: function() 
    {
        if (!this._storeMineralType) 
        {
            if (!this.memory.storeMineralType) 
            {
                this._storeMineralType = undefined;
            }
            else
            {
                this._storeMineralType = this.memory.storeMineralType;
            }
        }
        
        return this._storeMineralType;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(StructureController.prototype, 'link', {
    get: function() {
        if (!this._link) {
            let results = this.pos.findInRange(FIND_MY_STRUCTURES, 2, {filter: (structure) => { 
                return (structure.structureType == STRUCTURE_LINK) }});
            if(results.length > 0)
            {
                this._link = results[0];
            }
        }
        return this._link;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(StructureController.prototype, 'container', {
    get: function() {
        if (!this._container) {
            let results = this.pos.findInRange(FIND_STRUCTURES, 2, {filter: (structure) => { 
                return (structure.structureType == STRUCTURE_CONTAINER) }});
            if(results.length > 0)
            {
                this._container = results[0];
            }
        }
        return this._container;
    },
    enumerable: false,
    configurable: true
});

// Object.defineProperty(StructureContainer.prototype, 'memory', {
//     configurable: true,
//     get: function() {
//         if(_.isUndefined(Memory.myControllersMemory)) {
//             Memory.myControllersMemory = {};
//         }
//         if(!_.isObject(Memory.myControllersMemory)) {
//             return undefined;
//         }
//         return Memory.myControllersMemory[this.id] = 
//                 Memory.myControllersMemory[this.id] || {};
//     },
//     set: function(value) {
//         if(_.isUndefined(Memory.myControllersMemory)) {
//             Memory.myControllersMemory = {};
//         }
//         if(!_.isObject(Memory.myControllersMemory)) {
//             throw new Error('Could not set source memory');
//         }
//         Memory.myControllersMemory[this.id] = value;
//     }
// });

// Object.defineProperty(StructureContainer.prototype, 'storeType', {
//     get: function() 
//     {
//         if (!this._storeType) 
//         {
//             if (!this.memory.storeType) 
//             {
//                 this._storeType = undefined;
//             }
//             else
//             {
//                 this._storeType = this.memory.storeType;
//             }
//         }
        
//         return this._storeType;
//     },
//     enumerable: false,
//     configurable: true
// });