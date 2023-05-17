module.exports = {
    buildBody: function(maxEnergy)
    {
        let body = [];
        body.push(CARRY);
        body.push(CARRY);
        body.push(MOVE);
        return body;
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.store.getUsedCapacity()  == 0) 
        {
            let link = creep.room.storage.link;

            if (link && link.energy > 0)  //Withdraw from Link
            {
                if(creep.withdraw(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(link);
                }
            }
        }
        else 
        {
            if(creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(creep.room.storage);
            }
        }
    }
};
