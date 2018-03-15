// depends on prototype.game.js

Creep.prototype.runRole =
    function () 
    {
        Game.roles[this.memory.role].run(this);
    };