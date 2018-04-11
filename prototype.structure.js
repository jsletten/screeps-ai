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

Object.defineProperty(StructureContainer.prototype, 'transports', {
    get: function() {
        if (!this._creeps) {          
            this._creeps = _.filter(Game.creeps, (creep) => creep.memory.role == 'containerTransport' && creep.memory.containerID == this.id);
        }
        return this._creeps;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(StructureContainer.prototype, 'harvesters', {
    get: function() {
        if (!this._creeps) {          
            this._creeps = _.filter(Game.creeps, (creep) => creep.memory.role == 'containerHarvester' && creep.memory.containerID == this.id);
        }
        return this._creeps;
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