var request = require('./postRequest.js');
var pokemon = require('./pokemon.js');

exports.create = function(idFacebook,socket,login,X,Y,map) {
    this.id = idFacebook;
    socket.id = idFacebook;
    this.idFacebook = idFacebook;
    this.socket = socket;
    this.X = X;
    this.Y = Y;
    this.map = map;
    this.login = login;
    this.savePosition = savePosition;
    this.getPokemons = getPokemons;
    this.pokemons = [];
    this.room = "";
    socket.user = this;
    return this;
}
 
function savePosition() {
    data = new Object();
    data.X =  this.X;
    data.Y = this.Y;
    data.map =  this.map;
    var url = '/users/setPosition/'+this.id+'.json';
    var callback = function(response){};
    request.post(data,url,callback);
}

function getPokemons(socket) {   
    data = new Object();
    data.id = this.id;
    var url = '/pokemons/get/'+data.id+'.json';
    var callback = function(response, code, userSocket) {
            var i = 0;
            var pkms = [];
            for(var attributename in response){
                pkms.push(new pokemon.create(response[attributename]));
            }
            userSocket.user.pokemons  = pkms;
    };
    request.post(data,url,callback,socket);
}