exports.addUser = function(user) {
  this.array.push(user);
  console.log("Nb user connected : "+this.countUsers());
}
 
exports.countUsers = function() {
    var count = 0;
    for (var k in this.array) {
        if (this.array.hasOwnProperty(k)) {
           ++count;
        }
    }
    return count;
}

exports.deleteUser = function (user) {  
    for (var i = 0; i < this.array.length; i++) {
      if (user.map == this.array[i].map) { 
          try {
              this.array[i].socket.send('{"action" : "deletePlayer", "userId" : "'+user.id+'"}'); 
          } catch (e) {
              console.log(e);
          }
      }

    if (this.array[i].id == user.id)
       this.array.splice(i,1);
    }
    console.log("Nb user connected : "+this.countUsers());
}


exports.deleteUserFromMap = function (user, map) {  
    for (var i = 0; i < this.array.length; i++) {
      if (map == this.array[i].map) {
        try {
            this.array[i].socket.send('{"action" : "deletePlayer", "userId" : "'+user.id+'"}'); 
        } catch (e) {
            console.log(e);
        }
      }
    }
}



exports.getUser = function (id) {
   return this.array[id]; 
}

exports.isUserConnected = function (id) {
   var bool = false;
   for (var i = 0; i < this.array.length; i++) 
       if (this.array[i].idFacebook == id) 
          bool = true;
   return bool;
}

exports.notifyNewUser = function(newUser) {
    console.log("newUser id :"+newUser.login);
    for (var i = 0; i < this.array.length; i++) {

      if(this.array[i].id != newUser.id && this.array[i].map == newUser.map) {
        newUser.socket.send('{"action" : "newPlayer",'
                        +' "userId" : "'+this.array[i].id+'",'
                        +' "X" : "'+this.array[i].X+'",'
                        +' "Y" : "'+this.array[i].Y+'",'
                        +' "login" : "'+this.array[i].login+'",'
                        +' "map" : "'+this.array[i].map+'"}');

        this.array[i].socket.send('{"action" : "newPlayer",'
                                  +' "userId" : "'+newUser.id+'",'
                                  +' "login" : "'+newUser.login+'",'
                                  +' "X" : "'+newUser.X+'",'
                                  +' "Y" : "'+newUser.Y+'",'
                                  +' "map" : "'+newUser.map+'"}');

       }
    }
}

exports.getUserByFacebookId = function(id) {
  index = -1;
  for (var i = 0; i < this.array.length; i++)
      if (this.array[i].id == id) {
          index = i;
      }
  return this.array[index];
}


exports.array = [];
