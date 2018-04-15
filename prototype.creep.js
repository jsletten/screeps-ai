var Globals = require('globals');

Creep.prototype.runRole =
    function () 
    {
        // Use this code when renaming roles of active creeps
        if(this.memory.role == 'containerTransport')
        {
            this.memory.targetID = this.memory.targetID || this.memory.containerID;
        }
        //console.log('name: ' + this.name + ' role: ' + this.memory.role);
        Globals.roles[this.memory.role].run(this);
    };

Object.defineProperty(Creep.prototype, 'isFull', {
    get: function() {
        if (!this._isFull) {
            this._isFull = _.sum(this.carry) === this.carryCapacity;
        }
        return this._isFull;
    },
    enumerable: false,
    configurable: true
});