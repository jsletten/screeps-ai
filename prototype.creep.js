var Globals = require('globals');

Creep.prototype.runRole =
    function () 
    {
        //console.log('name: ' + this.name + ' role: ' +this.memory.role);
        Globals.roles[this.memory.role].run(this);
    };