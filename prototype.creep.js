// depends on prototype.game.js

Creep.prototype.runRole =
    function () 
    {
        Roles[this.memory.role].run(this);
    };