/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('common');
 * mod.thing == 'a thing'; // true
 */
const minHarvesters = 1;
const minContainerHarvesters = 0;
const minUpgraders = 1;
const minBuilders = 2;

// All possible types of harvesters
const creepHarvester = [
    [WORK, CARRY, MOVE],
    [WORK, WORK, CARRY, MOVE],
    [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
    [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE]
    ];

const creepDeliverer = [CARRY, CARRY, MOVE, MOVE];
/*
Possible deliverers:
    C, M =  100
    C, C, M, M = 200
    C, C, C, M, M, M = 300
    C, C, C, C, M, M, M, M = 400
    C*5, M*5 = 500  (max 550)
*/

// All possible types of container harvesters:
const creepContainerHarvester = [
    [WORK, MOVE],
    [WORK, WORK, MOVE],
    [WORK, WORK, WORK, MOVE],
    [WORK, WORK, WORK, WORK, MOVE],
    [WORK, WORK, WORK, WORK, WORK, MOVE]
    ];

const creepUpgrader = [
    [WORK, CARRY, MOVE],
    [WORK, WORK, CARRY, MOVE],
    [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
    [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE]
    ];

const creepBuilder = [
    [WORK, CARRY, MOVE],
    [WORK, CARRY, CARRY, MOVE, MOVE],
    [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
    ];

function spawnCreep(creepMods, creepRole)   // creepMods - array of creep builds, role - is the role
{
    var currentCreep = creepMods[0];   // Select the cheapest creep for beginning
    for (creepMod in creepMods)    // looking for all possible creeps of that type
    {
        if (creepPrice(creepMods[creepMod]) < Game.rooms['W3N5'].energyAvailable)  // if room has enough energy, then spawn the largest creep of this type
            currentCreep = creepMods[creepMod];
    }
    console.log('Spawning ', creepRole, ' :', currentCreep, ' with energy price: ', creepPrice(currentCreep) );
    Game.spawns['Spawn1'].spawnCreep(currentCreep, creepRole + Game.time.toString(), { memory: { role: creepRole } });
}

// Returns price of creep in energy
function creepPrice(creepPartsArray)
{
    var price = 0;
    for (var creepPart in creepPartsArray)
    {
        switch (creepPartsArray[creepPart].toUpperCase())
        {
            case 'WORK':
                price = price + 100;
                break;

            case 'MOVE':
                price = price + 50;
                break;

            case 'CARRY':
                price = price + 50;
                break;

            case 'ATTACK':
                price = price + 80;
                break;

            case 'RANGED_ATTACK':
                price = price + 150;
                break;

            case 'HEAL':
                price = price + 250;
                break;

            case 'CLAIM':
                price = price + 600;
                break;

            case 'TOUGH':
                price = price + 10;
                break;
        }
    }

    return price;
}

// checks Memory for entries of missing (dead) creeps and removes them
function clearMemory()
{
    console.log('Clearing memory');
    for (memCreep in Memory.creeps)
    {
        if (!Game.creeps[memCreep])
            delete Memory.creeps[memCreep];
    }
}

// gatherEnergy(creep) - function for creep to gather energy. First looks for container with energy and gets it from there.
// If no containers with energy, then it looks for energy source and gathers energy from it.
//
module.exports.gatherEnergy = function (creep) {
        // Finding a container
        var sources = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER)
            }
        });
        
        // If there are no containers found or container contains too few energy, then looking for sources
        if (sources.length<1 || sources[0].store[RESOURCE_ENERGY] < creep.energyCapacityAvailable)
        {
            sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
        else    // If there is container found and it contains energy
        {
        
            if (creep.withdraw(sources[0], RESOURCE_ENERGY, creep.energyCapacityAvailable) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    }

// spawnCreeps() - function to check for existing creeps and spawn missing creeps
module.exports.spawnCreeps = function ()
{
    if (Game.spawns['Spawn1'].spawning) // If spawner is already spawning something, then leaving this function
        return;

    if (_.filter(Game.creeps, function (creep) { return creep.memory.role == 'harvester' && creep.ticksToLive > 20; }).length < minHarvesters) {
        clearMemory();  // Clear memory from dead creeps
        spawnCreep(creepHarvester, 'harvester');
        return; // Not to try spawning additional creeps this turn
    }

    if (_.filter(Game.creeps, function (creep) { return creep.memory.role == 'harvesterContainer' && creep.ticksToLive > 12; }).length < minContainerHarvesters) {
        clearMemory();
        spawnCreep(creepContainerHarvester, 'harvesterContainer');
        return;
    }

    if (_.filter(Game.creeps, function (creep) { return creep.memory.role == 'upgrader' && creep.ticksToLive > 12; }).length < minUpgraders) {
        clearMemory();
        spawnCreep(creepUpgrader, 'upgrader');
        return;
    }

    if (_.filter(Game.creeps, function (creep) { return creep.memory.role == 'builder' && creep.ticksToLive > 12; }).length < minBuilders) {
        clearMemory();
        spawnCreep(creepBuilder, 'builder');
        return;
    }

}


// module.exports = gatherEnergy;

//module.exports = {
//};