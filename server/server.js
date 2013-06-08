var users   = require('./users');
var rooms   = require('./rooms.js'); 
var id      = require('./id.js');
var pokemon = require('./pokemon.js');
var user    = require('./user.js');
var WebSocketServer = require('ws').Server, wss = new WebSocketServer({port: 1337});
var date = new Date();
var postRequest = require('./postRequest.js');



process.on('not opened', function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});



wss.on('connection', function(socket){    
try {

    //Reception d'un message
    socket.on('message', function(string) {
        isMessageValid = true;
        try {
             message = JSON.parse(string);
        } catch (e) {
             isMessageValid = false;
        }
        if (isMessageValid) {
             console.log(message.action);
             

/******************************************************************************
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*******************************************************************************
*****                                                                     *****
*****                             ACTIONS                                 *****
*****                                                                     *****
*******************************************************************************
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
******************************************************************************/
/******************************************************************************
*****                                                                     *****
*****                           LOGIN                                     *****
*****                                                                     *****
******************************************************************************/

// Connexion utilisateur
if (message.action == 'connectUser') {

    if (!users.isUserConnected(message['idFacebook'])) {

        var url = '/users/connect/'+message['idFacebook']+'/.json';

        var callback = function (response,userSocket) {
            parsedResponse = JSON.parse(response);
            player = new user.create(parsedResponse.idFacebook, userSocket, parsedResponse.login, parsedResponse.X, parsedResponse.Y,parsedResponse.map);                
            users.addUser(player);

            if(parsedResponse.action == 'connected') {
                player.getPokemons(userSocket);
            }

            userSocket.send(response);
        };
        postRequest.get(url,callback,socket);

    } else {
        response = { };
        response.action = "notConnected";
        socket.send(JSON.stringify(response));
    }
}


//Perte de la connection
socket.on('close', function() {
  if (socket.user) 
      if(users.isUserConnected(socket.id)) {
          socket.user.savePosition();
          users.deleteUser(socket.user);
      }
});

//Creation de compte
if(message.action == 'createUser') {
    var callback = function (response, statusCode, userSocket) {
        if (statusCode == 200) {
            userSocket.user.login = response.login;
            response = { };
            response.action = "profileCreated";
            response.userId = userSocket.user.id;
            response.login = userSocket.user.login;
            
            userSocket.send(JSON.stringify(response));
        } else {
            console.log(statusCode);
        }
    }

    data = new Object();
    data.idFacebook = socket.user.idFacebook;
    data.login = message['login'];
    url = '/users/add.json';

    postRequest.post(data,url,callback,socket);
}


/******************************************************************************
*****                                                                     *****
*****                           MAP                                       *****
*****                                                                     *****
******************************************************************************/

 //Nouveau joueur sur la map
 if(message.action == 'newPlayer') {
     newUser = users.getUserByFacebookId(message.idFacebook);
     console.log("New User: " +newUser.login+" X: "+newUser.X+" Y :"+newUser.Y);
     if(newUser)
        users.notifyNewUser(newUser); 
 }
 //Position des autres joueurs sur la map
 if(message.action == 'sendPosition') {

    if (message['map'] != socket.user.map) {
        socket.user.map = message['map'];
        socket.user.savePosition();
    }

    socket.user.X = message['X'];
    socket.user.Y = message['Y'];

    response = { };
    response.action = "setPosition";
    response.userId = socket.user.id;
    response.X = message['X'];
    response.Y = message['Y'];

    for (var i = 0; i < users.array.length; i++) {
        if(users.array[i].map == socket.user.map)
            users.array[i].socket.send(JSON.stringify(response));
    }
 }
 
  //Changement de Map
 if(message.action == 'changeMap') {
    //users.deleteUserFromMap(socket.user,message['oldMap']);
    response = { };
    response.action = "goToWarp";
    response.userId = socket.user.id;
    response.X = message['oldX'];
    response.Y = message['oldY'];

    for (var i = 0; i < users.array.length; i++) {
        if(users.array[i].map == message['oldMap'])
            users.array[i].socket.send(JSON.stringify(response));
    }


    socket.user.X = message['X'];
    socket.user.Y = message['Y'];
    socket.user.map = message['newMap'];
    users.notifyNewUser(socket.user);
 }



/******************************************************************************
*****                                                                     *****
*****                       COMBATS PVP                                   *****
*****                                                                     *****
******************************************************************************/
// Request
if(message.action == 'battleRequest') {
    socket.user.savePosition();
    room = new rooms.createRoom(socket.user,socket);

    responseOpp = new Object();
    responseOpp.action = 'battleRequest';
    responseOpp.id = socket.user.idFacebook;
    responseOpp.login = socket.user.login;
    responseOpp.roomId = room.id;
    socket.user.room = room.id;
    var opponent = users.getUserByFacebookId(message['id']);
    opponent.socket.send(JSON.stringify(responseOpp));
}

//Accept request
if(message.action == 'acceptBattleRequest') {
  socket.user.savePosition();
     try {
         socket.user.room = message['id'];
         var room = rooms.getRoom(message['id']);
         room.joinRoom(socket.user,socket);
     } catch (e) {
         console.log(e);
         rooms.deleteRoom(message['id']);
     }
}


// Creation d'une salle
if(message.action == 'createRoom') {
    rooms.createRoom(socket.user,socket);
}

//rejoindre une salle
if(message.action == 'joinRoom') {
     try {
         rooms.getRoom(socket.user.room).joinRoom(users.getUser(socket.id),socket);
     } catch (e) {
         console.log(e);
         rooms.deleteRoom(message['roomId']);
     }
}
 
 //choix du pokemon
 if(message.action == 'newPokemon') {
        new pokemon.register(message['pokemonId'],socket);
 }

 //Lister les pokemons d'une room
 if(message.action == 'getPokemons') {
      rooms.getRoom(socket.user.room).getPokemons(socket.user);
 }

 //Attaquer
 if(message.action == 'attack') {
     rooms.getRoom(socket.user.room).addAttackToBuffer(socket.user, message['attackId']);
 }

/* if (message.action == 'heal') {
     socket.user.pokemon = new pokemon.create(users.getUser(socket.id).pokemon.ID); 
 }*/




/******************************************************************************
*****                                                                     *****
*****                           FIN ACTIONS                               *****
*****                                                                     *****
******************************************************************************/

            
         }
    });
} catch (e) {
    console.log(e);
}

});

