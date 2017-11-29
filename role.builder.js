/*
Script for builder creep
It takes energy from container or energy source (if container is empty)
Then it looks for unbuilt structures and performs building task on the most completed structure
If there are nothing to be built, then it's looking for structures, that needs repairing (damaged more than on 10%) and repairs it.
*/

var common = require('common');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvest');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('build');
	    }

	    if(creep.memory.building) {
	        var buildTargets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (buildTargets.length) {
                // Searching for the most completed site to finish it in the first time
                var completestSiteNumber = 0;
                var completestSiteProgress = buildTargets[completestSiteNumber].progress;
                for (var site in buildTargets)
                {
                    if (buildTargets[site].progress > completestSiteProgress)
                    {
                        completestSiteNumber = site;
                        completestSiteProgress = buildTargets[site].progress;
                    }
                }
                // console.log('Completest site progress = ', completestSiteProgress);
                if (creep.build(buildTargets[completestSiteNumber]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(buildTargets[completestSiteNumber], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
            else {  // No valid targets found for building, we need to free space near energy source
                // console.log('Nothing to build');
                var repairTargets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.hits < (structure.hitsMax - (structure.hitsMax/10)) );     // All structures, that are damaged more than for 10%
                    }
                });
                if (creep.repair(repairTargets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(repairTargets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }



                //var spawnss = creep.room.find(FIND_STRUCTURES, {
                //    filter: { structureType: STRUCTURE_SPAWN }
                //});
                //creep.moveTo(spawnss[0], { visualizePathStyle: { stroke: '#ffaa00' } });
            }
            {

            }
	    }
	    else {
	        common.gatherEnergy(creep);
	        // var sources = creep.room.find(FIND_SOURCES);
            // if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            //    creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
            
	    }
	}
};

module.exports = roleBuilder;