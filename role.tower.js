module.exports = {
    
    run: function() {
        let towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);

        for(towerID in towers)
        {
            let tower = towers[towerID];
        
            if(tower) {
                if(tower.energy > 0) {
                    let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    if(closestHostile) {
                        tower.attack(closestHostile);
                    }
                    else {
                        let damagedCreeps = tower.room.find(FIND_MY_CREEPS, {filter: object => object.hits < object.hitsMax && object.memory.role != 'tank'});
                        damagedCreeps.sort((a,b) => a.hits - b.hits);

                        if(damagedCreeps.length > 0) {
                            tower.heal(damagedCreeps[0]);
                        }
                        else {
                            let damagedStructures = tower.room.find(FIND_STRUCTURES, {filter: object => object.hits < object.hitsMax});
                            damagedStructures.sort((a,b) => a.hits - b.hits);
                
                            if(damagedStructures.length > 0) {
                                if(damagedStructures[0].hits < tower.room.controller.level * 100000) {
                                    tower.repair(damagedStructures[0]);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

