Object.defineProperty(StructureContainer.prototype, 'transports', {
    get: function() {
        if (!this._transports) {          
            this._transports = _.filter(Game.creeps, (creep) => creep.memory.role == 'containerTransport' && creep.memory.targetID == this.id);
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