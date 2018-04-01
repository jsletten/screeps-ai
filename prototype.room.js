Object.defineProperty(Room.prototype, 'sources', {
    get: function() {
        if (!this._sources) {
            this._sources = this.find(FIND_SOURCES);
        }
        return this._sources;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Room.prototype, 'containers', {
    get: function() {
        if (!this._containers) {
            this._containers = this.find(FIND_STRUCTURES, {filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER) }});
        }
        return this._containers;
    },
    enumerable: false,
    configurable: true
});
