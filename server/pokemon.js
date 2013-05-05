var pokemonsTemplate = require('./pokemons');
var skill            = require('./skill');
var element    = require('./elements');

function create(id) {
     this.ID        = pokemonsTemplate.pokemons[id].ID;
     this.NAME      = pokemonsTemplate.pokemons[id].NAME;
     this.PV        = pokemonsTemplate.pokemons[id].PV;  
     this.PVInitial = pokemonsTemplate.pokemons[id].PV;
     this.ATK       = pokemonsTemplate.pokemons[id].ATK;
     this.DEF       = pokemonsTemplate.pokemons[id].DEF;
     this.ASP       = pokemonsTemplate.pokemons[id].ASP;
     this.DSP       = pokemonsTemplate.pokemons[id].DSP;
     this.VIT       = pokemonsTemplate.pokemons[id].VIT;
     this.TYPE      = pokemonsTemplate.pokemons[id].TYPE;
     this.attack    = attack;
     this.skills    = {};
     this.skills[1] = new skill.create(pokemonsTemplate.pokemons[id].attack[1]);
     this.skills[2] = new skill.create(pokemonsTemplate.pokemons[id].attack[2]);
     this.skills[3] = new skill.create(pokemonsTemplate.pokemons[id].attack[3]);
     this.skills[4] = new skill.create(pokemonsTemplate.pokemons[id].attack[4]);

     return this;
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
