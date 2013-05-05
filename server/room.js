//var attackBuffer = [];


function create(id,user){
    this.id = id;
    this.available = true;
    this.playerOne = user;
    this.attackBuffer = [];

    //mthods
    this.addAttackToBuffer = addAttackToBuffer;
    this.startRound = startRound;
    this.playRound = playRound;
    this.getPokemons = getPokemons;
    this.join = join;
    return this;
}

function addAttackToBuffer(user,attackId) {
    this.attackBuffer[user.id] = attackId;
    var key, count = 0;
    for(key in this.attackBuffer) {
        if(this.attackBuffer.hasOwnProperty(key)) {
            count++;
        }
    }
    console.log(user.id+'! '+this.attackBuffer+'! room: '+this.id);
    if(count == 2) {
        this.startRound();
        this.attackBuffer = [];
    } 
}

function startRound() {
    var starter, follower;
    if(this.playerOne.pokemon.VIT >= this.playerTwo.pokemon.VIT) {
        starter = this.playerOne;
        follower = this.playerTwo;
    } else {
        starter = this.playerTwo;
        follower = this.playerOne;
    }

    console.log(starter)
    this.playRound(starter,follower);
}

function playRound(starter, follower) {
    var starterAtk  = starter.pokemon.attack(this, starter, this.attackBuffer[starter.id]);
    var followerAtk = follower.pokemon.attack(this, follower, this.attackBuffer[follower.id]);
    console.log("debug : "+starterAtk.name);
    console.log("dmg : "+starterAtk.damage);
    starter.socket.send('{"action" : "round", "content" : {"1" : {"action" : "attack", "attackId" : "1", "attackLabel" : "'+starterAtk['name']+'", "damage" : "'+starterAtk.damage+'"}, "2" : {"action" : "attacked", "attackId" : "1","attackLabel" : "'+followerAtk['name']+'", "damage" : "'+followerAtk['damage']+'"}}}');
    follower.socket.send('{"action" : "round", "content" : {"1" : {"action" : "attacked", "attacked" : "1", "attackLabel" : "'+starterAtk['name']+'", "damage" : "'+starterAtk['damage']+'"}, "2" : {"action" : "attack", "attackId" : "1", "attackLabel" : "'+followerAtk['name']+'", "damage" : "'+followerAtk['damage']+'"}}}');

    console.log("attaque");

}

function getPokemons(user) {

console.log(this.playerOne.pokemon);
console.log(this.playerTwo.pokemon);

   if(this.playerOne.id == user.id)
        user.socket.send('{"action" : "setPokemon",'
                         +'"playerPokemonId"   : "'+this.playerOne.pokemon.ID+'",'
                         +'"playerPokemonName" : "'+this.playerOne.pokemon.NAME+'",'
                         +'"playerPokemonPV"   : "'+this.playerOne.pokemon.PV+'",'
                         +'"ennemyPokemonId"   : "'+this.playerTwo.pokemon.ID+'",'
                         +'"ennemyPokemonName" : "'+this.playerTwo.pokemon.NAME+'",'
                         +'"ennemyPokemonPV"   : "'+this.playerTwo.pokemon.PV+'",'
                         +'"atk1Label"         : "'+this.playerOne.pokemon.skills[1].name+'",'
                         +'"atk2Label"         : "'+this.playerOne.pokemon.skills[2].name+'",'
                         +'"atk3Label"         : "'+this.playerOne.pokemon.skills[3].name+'",'
                         +'"atk4Label"         : "'+this.playerOne.pokemon.skills[4].name+'"'
                         +'}');
   else
        user.socket.send('{"action" : "setPokemon",'
                         +'"playerPokemonId"   : "'+this.playerTwo.pokemon.ID+'",'
                         +'"playerPokemonName" : "'+this.playerTwo.pokemon.NAME+'",'
                         +'"playerPokemonPV"   : "'+this.playerTwo.pokemon.PV+'",'
                         +'"ennemyPokemonId"   : "'+this.playerOne.pokemon.ID+'",'
                         +'"ennemyPokemonName" : "'+this.playerOne.pokemon.NAME+'",'
                         +'"ennemyPokemonPV"   : "'+this.playerOne.pokemon.PV+'",'
                         +'"atk1Label"         : "'+this.playerTwo.pokemon.skills[1].name+'",'
                         +'"atk2Label"         : "'+this.playerTwo.pokemon.skills[2].name+'",'
                         +'"atk3Label"         : "'+this.playerTwo.pokemon.skills[3].name+'",'
                         +'"atk4Label"         : "'+this.playerTwo.pokemon.skills[4].name+'"'
                         +'}');

}

function join( user, socket) {
    if(this && this.available) {
        this.available = false;
        this.playerTwo = user;
        this.playerOne.socket.send('{"action" : "gameStarted", "roomId" : "'+this.id+'"}');
        this.playerTwo.socket.send('{"action" : "gameStarted", "roomId" : "'+this.id+'"}');

        console.log(this.playerOne.id);
        console.log(this.playerTwo.id);
    }
}



//exports.join = join;
//exports.getPokemons = getPokemons;
exports.create = create;
//exports.addAttackToBuffer = addAttackToBuffer;
//exports.startRound = startRound;
//exports.playRound = playRound;
//exports.attackBuffer = attackBuffer;
