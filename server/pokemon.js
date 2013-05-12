var pokemonsTemplate = require('./pokemons');
var skill            = require('./skill');
var element    = require('./elements');
var request = require('./postRequest.js');

function create(id, socket) {
    data = new Object();
    data.idFacebook = socket.user.id;
    data.idPokemon = id;
    url = '/pokemons/create.json';
    function callback(response, code, userSocket) {
        userSocket.user.pokemons[1] = response;
    }
    request.post(data,url,callback,socket);
}


function attack(room,user, attackId) {
    var attack = {};
    // Qui est Qui??
    if (user.id == room.playerOne.id) {
         player = room.playerOne;
         ennemy = room.playerTwo;
    } else {
         player = room.playerTwo;
         ennemy = room.playerOne;
    }
 
    attack['name'] = player.pokemon.skills[attackId].name;

    // Calcul des degats
    var niv = 10;
    var atk = player.pokemon.ATK;
    var pui = player.pokemon.skills[attackId].power;
    var def = player.pokemon.DEF;
    var CE  = 1;
    attack['damage'] =Math.round((((niv*0.4+2)*atk*pui)/(def*50+2)+2)*element.matrix[player.pokemon.skills[attackId].type][ennemy.pokemon.TYPE]);
    
    //Aplication des dammages
    
    ennemy.pokemon.PV = ennemy.pokemon.PV-attack['damage'];
    console.log("ATK : "+attack);
    return attack;
}

exports.create = create;
exports.attack = attack;
