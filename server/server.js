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

        var url = '/MegaMonster/users/connect/'+message['idFacebook']+'/.json';

        var callback = function (response) {
        parsedResponse = JSON.parse(response);
        player = new user.create(parsedResponse.idFacebook, socket, parsedResponse.login, parsedResponse.X, parsedResponse.Y);                
        users.addUser(player);
        console.log(response);
        socket.send(response);
        };

        postRequest.get(url,callback);

    } else {
        response = { };
        response.action = "notConnected";
        socket.send(JSON.stringify(response));
    }
}


//Perte de la connection
socket.on('close', function() { 
    if(users.isUserConnected(socket.user.id)) {
        socket.user.savePosition();
        users.deleteUser(socket.id);
    }
});

//Creation de compte
if(message.action == 'createUser') {
    var callback = function (response, statusCode) {
        console.log(response);
        if (statusCode == 200) {
            socket.user.login = response.login;
            response = { };
            response.action = "profileCreated";
            response.userId = socket.user.id;
            response.login = socket.user.login;
            
            socket.send(JSON.stringify(response));
        } else {
            console.log(statusCode);
        }
    }

    data = new Object();
    data.idFacebook = socket.user.idFacebook;
    data.login = message['login'];
    url = '/MegaMonster/users/add.json';

    postRequest.post(data,url,callback);
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
    
    socket.user.X = message['X'];
    socket.user.Y = message['Y'];

    response = { };
    response.action = "setPosition";
    response.userId = socket.user.id;
    response.X = message['X'];
    response.Y = message['Y'];

    for (var i = 0; i < users.array.length; i++) {
        users.array[i].socket.send(JSON.stringify(response));
        console.log(JSON.stringify(response));
    }

 }



/******************************************************************************
*****                                                                     *****
*****                           COMBATS                                   *****
*****                                                                     *****
******************************************************************************/

            // Creation d'une salle
            if(message.action == 'createRoom') {
                rooms.createRoom(users.getUser(socket.id),socket);
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
             if(message.action == 'choosePokemon') {
                  users.getUser(socket.id).pokemon = new pokemon.create(message['pokemonId']);
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

