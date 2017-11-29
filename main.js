// Game.spawns['Spawn1'].spawnCreep( [WORK, CARRY, MOVE], 'Harvester1',     { memory: { role: 'harvester' } } );
//  Game.spawns['Spawn1'].spawnCreep( [WORK, CARRY, MOVE], 'Builder1',     { memory: { role: 'builder' } } );
// Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, MOVE], 'HarvesterContainer1', { memory: { role: 'harvesterContainer' } });
// Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], 'Upgrader3', { memory: { role: 'upgrader' } } );


var roleHarvester = require('role.harvester');
var roleHarvesterContainer = require('role.harvesterContainer');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var common = require('common');

module.exports.loop = function () {

    // Automatically spawns at least 1 screep for roles 'harvester' and 'upgrader'
    // common.spawnCreeps();
               
    for (var name in Game.creeps) {
        
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }

        if (creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
        }

        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        
        if (creep.memory.role == 'harvesterContainer') {
            roleHarvesterContainer.run(creep);
        }
    }
};