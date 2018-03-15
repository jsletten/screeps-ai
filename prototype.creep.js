

Creep.prototype.runRole =
    function () 
    {
        roles[this.memory.role].run(this);
    };