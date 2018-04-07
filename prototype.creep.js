var Globals = require('globals');

Creep.prototype.runRole =
    function () 
    {
        if(this.memory.role == 'containerHauler')
        {
            this.memory.role = 'containerTransport';
        }
        console.log('name: ' + this.name + ' role: ' + this.memory.role);
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