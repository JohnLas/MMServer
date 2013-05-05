var id = require('./id');
var room = require('./room.js');
var rooms = {}

function createRoom(user,socket) {
    newRoom = new room.create(id.makeId(),user);
    rooms[newRoom.id] = newRoom;
    socket.send('{"action" : "roomHasBeenCreated", "roomId" : "'+newRoom.id+'"}');
    console.log('roomHasBeenCreated');
}
function deleteRoom(roomId) {
    delete rooms[roomId];
}

function getRoom(roomId) {
    return rooms[roomId];
}


exports.createRoom = createRoom;
exports.deleteRoom = deleteRoom;
exports.getRoom   = getRoom;
