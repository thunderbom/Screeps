
module.exports.drawVisuals = function () {
    new RoomVisual().text(Game.rooms['W72S22'].energyAvailable + '/' + Game.rooms['W72S22'].energyCapacityAvailable, Game.spawns['Spawn1'].pos.x, Game.spawns['Spawn1'].pos.y + 1.5, { align: 'center' });
}