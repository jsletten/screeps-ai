var Globals = require('globals');

Creep.prototype.runRole =
    function () 
    {
        Globals.roles[this.memory.role].run(this);
    };