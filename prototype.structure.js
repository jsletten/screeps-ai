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