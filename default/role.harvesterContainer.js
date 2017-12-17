/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */

// module.exports = {
// };

var roleHarvesterContainer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        var containers = creep.room.find(FIND_STRUCTURES, {
            filter: (struct) =>
                    (struct.structureType == STRUCTURE_CONTAINER)
        });
        
        
        // at first we have to move the creep over a container, so energy will fall in it
        // probably we first have to look at that coord, if someone is standing there, then do nothins (to save CPU) or mine energy to floor (to save time)
        // also good idea first to look under a creep, probably it's already standing over a some container, then do nothing
        // we also can do a loop to cycle through all containers and move to the free one, cause we can have more than 1 container
        if (creep.pos.x == containers[0].pos.x && creep.pos.y == containers[0].pos.y)
        // we cannot compare .pos itself,because it's an object, so we have to compare pos.x and pos.y
        {
            // If creep is already standing over the container, then start to mine it
            var sources = creep.room.find(FIND_SOURCES);
            //if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            //    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            //}
            creep.harvest(sources[0]);
        }
        
        else {  
            console.log(creep.pos);
            console.log(containers[0].pos);
            creep.moveTo(containers[0]);
        }
    }
};

module.exports = roleHarvesterContainer;