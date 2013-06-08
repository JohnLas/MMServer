var pokemons = require('./pokemons');
var skill    = require('./skill');
var element  = require('./elements');
var request = require('./postRequest.js');


function create (pkm) {
    this.id = pkm.id;
    this.refId = pkm.refId;
    this.userId = pkm.userId;
    this.name = pkm.name;
    this.life = pkm.life;
    this.atk = pkm.atk;
    this.def = pkm.def;
    this.asp = pkm.asp;
    this.dsp = pkm.dsp;
    this.vit = pkm.vit;
    this.type = pkm.type;
    this.skills = [];
    console.log(pkm);
    this.skills[1] = new skill.create(pkm.attack1id)
    this.skills[2] = new skill.create(pkm.attack2id)
    this.skills[3] = new skill.create(pkm.attack3id)
    this.skills[4] = new skill.create(pkm.attack4id)
    this.attack = attack;
    return this;
}

function register(id, socket) {
    data = new Object();
    data.idFacebook = socket.user.id;
    data.idPokemon = id;
    url = '/pokemons/create.json';
    console.log("Pkm "+id);
    function callback(response, code, userSocket) {
        console.log(response);
        pokemon = this.create(response);
        userSocket.user.pokemons.push(pokemon);
    }
    request.post(data,url,callback,socket);
}


function attack(room,user,attackId) {
    var attack = {};
    // Qui est Qui??
    if (user.id == room.playerOne.id) {
         player = room.playerOne;
         ennemy = room.playerTwo;
    } else {
         player = room.playerTwo;
         ennemy = room.playerOne;
    }
 
    attack['name'] = player.currentPokemon.skills[attackId].name;

    // Calcul des degats
    var niv = 10;
    var atk = player.currentPokemon.atk;
    var pui = player.currentPokemon.skills[attackId].power;
    var def = player.currentPokemon.def;
    var CE  = 1;
    attack['damage'] =Math.round((((niv*0.4+2)*atk*pui)/(def*50+2)+2)*element.matrix[player.currentPokemon.skills[attackId].type][ennemy.currentPokemon.type])+1;
    
    //Aplication des dammages
    
    ennemy.currentPokemon.pv = ennemy.currentPokemon.pv-attack['damage'];
    console.log("ATK : "+attack['damage']+" coeff "+element.matrix[player.currentPokemon.skills[attackId].type][ennemy.currentPokemon.type]+" type atk "+player.currentPokemon.skills[attackId].type+" type ennemy "+ennemy.currentPokemon.type);
    return attack;
}




exports.create = create;
exports.register = register;
exports.attack = attack;
