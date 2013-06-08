var id = require('./id');
var room = require('./room.js');
var rooms = [];

function createRoom(user,socket) {
    newRoom = new room.create(id.create(),user);
    rooms.push(newRoom);
    return newRoom;
}
function deleteRoom(roomId) {
    delete rooms[roomId];
}

function getRoom(roomId) {
  index = -1;
  for (var i = 0; i < rooms.length; i++) 
      if (rooms[i].id == roomId) {
      	  
          index = i;
      }

  return rooms[index];
}

exports.array = rooms;
exports.createRoom = createRoom;
exports.deleteRoom = deleteRoom;
exports.getRoom   = getRoom;
