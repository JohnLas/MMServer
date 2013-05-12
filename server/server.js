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
             //console.log(message.action);
             

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
    if(users.isUserConnected(socket.id)) {
        socket.user.savePosition();
        users.deleteUser(socket.user);
    }
});

//Creation de compte
if(message.action == 'createUser') {
    var callback = function (response, statusCode, userSocket) {
        console.log(response);
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
    users.deleteUserFromMap(socket.user,message['oldMap']);
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
    console.log(message);
    room = new rooms.createRoom(socket.user,socket);

    responseOpp = new Object();
    responseOpp.action = 'battleRequest';
    responseOpp.id = socket.user.idFacebook;
    responseOpp.login = socket.user.login;
    responseOpp.roomId = room.id;
    var opponent = users.getUserByFacebookId(message['idOpponent']);$
    opponent.socket.send(JSON.stringify(response));
}

//Accept request
if(message.action == 'acceptBattleRequest') {
     try {
         rooms.getRoom(message['roomId']).join(socket.user,socket);
     } catch (e) {
         console.log(e);
         rooms.deleteRoom(message['roomId']);
     }
}


// Creation d'une salle
if(message.action == 'createRoom') {
    rooms.createRoom(socket.user,socket);
}

//rejoindre une salle
if(message.action == 'joinRoom') {
     try {
         rooms.getRoom(message['roomId']).join(users.getUser(socket.id),socket);
     } catch (e) {
         console.log(e);
         rooms.deleteRoom(message['roomId']);
     }
}
 
 //choix du pokemon
 if(message.action == 'newPokemon') {
        new pokemon.create(message['pokemonId'],socket);
 }

 //Lister les pokemons d'une room
 if(message.action == 'getPokemons') {
      rooms.getRoom(message['roomId']).getPokemons(users.getUser(socket.id));
 }

 //Attaquer
 if(message.action == 'attack') {
     rooms.getRoom(message['roomId']).addAttackToBuffer(users.getUser(socket.id), message['attackId']);
 }

 if (message.action == 'heal') {
     users.getUser(socket.id).pokemon = new pokemon.create(users.getUser(socket.id).pokemon.ID); 
 }




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

