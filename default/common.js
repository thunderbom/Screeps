/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('common');
 * mod.thing == 'a thing'; // true
 */

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
        if (creepPrice(creepMods[creepMod]) < Game.rooms['W72S22'].energyAvailable)  // if room has enough energy, then spawn the largest creep of this type
            currentCreep = creepMods[creepMod];
    }
    console.log('Spawning ', creepRole, ' :', currentCreep, ' with energy price: ', creepPrice(currentCreep) );
    Game.spawns['Spawn1'].spawnCreep(currentCreep, creepRole + Game.time.toString(), { memory: { role: creepRole } });
}

// Returns price of creep in energy
function creepPrice(creepParts)
{
    var price = 0;
    for (var creepPart in creepParts)
    {
        price = price + BODYPART_COST[creepParts[creepPart]];
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
        
        //var sources = creep.room.find(FIND_DROPPED_ENERGY, {
        //    filter: (nrg) =>
        //            (nrj.structureType == STRUCTURE_CONTAINER) && 
        //            (nrj.store[RESOURCE_ENERGY] > creep.carryCapacity)
        //});
        
        
        // Finding a container that has more energy then the creep's can carry
        var sources = creep.room.find(FIND_STRUCTURES, {
            filter: (struct) =>
                    (struct.structureType == STRUCTURE_CONTAINER) && 
                    (struct.store[RESOURCE_ENERGY] > creep.carryCapacity)
        });

        // If there are no containers found or container contains too few energy, then looking for energy sources
        if (sources.length<1)
        {
            sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffff00' } }); // path to energy source marked with yellow
            }
        }
        else    // If there is container found and it contains energy, then withdrawing energy from it
        {
            if (creep.withdraw(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#0000ff' } });    // path to container marked with blue
            }
        }
    }

// spawnCreeps() - function to check for existing creeps and spawn missing creeps
module.exports.spawnCreeps = function ()
{
    if (Game.spawns['Spawn1'].spawning) // If spawner is already spawning something, then leaving this function
        return;

    if (_.filter(Game.creeps, function (creep) { return creep.memory.role == 'harvester' && creep.ticksToLive > 20; }).length < Memory.vars.minHarvesters) {
        clearMemory();  // Clear memory from dead creeps
        spawnCreep(creepHarvester, 'harvester');
        return; // Not to try spawning additional creeps this turn
    }

    if (_.filter(Game.creeps, function (creep) { return creep.memory.role == 'harvesterContainer' && creep.ticksToLive > 12; }).length < Memory.vars.minContainerHarvesters) {
        clearMemory();
        spawnCreep(creepContainerHarvester, 'harvesterContainer');
        return;
    }

    if (_.filter(Game.creeps, function (creep) { return creep.memory.role == 'upgrader' && creep.ticksToLive > 12; }).length < Memory.vars.minUpgraders) {
        clearMemory();
        spawnCreep(creepUpgrader, 'upgrader');
        return;
    }

    if (_.filter(Game.creeps, function (creep) { return creep.memory.role == 'builder' && creep.ticksToLive > 12; }).length < Memory.vars.minBuilders) {
        clearMemory();
        spawnCreep(creepBuilder, 'builder');
        return;
    }

}


// module.exports = gatherEnergy;

//module.exports = {
//};