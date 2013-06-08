//var attackBuffer = ;


function create(id,user){
    this.id = id;
    this.available = true;
    this.playerOne = user;
    this.attackBuffer = {};

    //mthods
    this.addAttackToBuffer = addAttackToBuffer;
    this.startRound = startRound;
    this.playRound = playRound;
    this.getPokemons = getPokemons;
    this.joinRoom = joinRoom;
    return this;
}

function addAttackToBuffer(user,attackid) {
    this.attackBuffer[user.id] = attackid;
    var key, count = 0;
    for(key in this.attackBuffer) {
        if(this.attackBuffer.hasOwnProperty(key)) {
            count++;
        }
    }
    if(count == 2) {
        this.startRound();
        this.attackBuffer = [];
    } 
}

function startRound() {
    var starter, follower;
    if(this.playerOne.currentPokemon.vit >= this.playerTwo.currentPokemon.vit) {
        starter = this.playerOne;
        follower = this.playerTwo;
    } else {
        starter = this.playerTwo;
        follower = this.playerOne;
    }
    this.playRound(starter,follower);
}

function playRound(starter, follower) {
    var starterAtk  = starter.currentPokemon.attack(this, starter, this.attackBuffer[starter.id]);
    var followerAtk = follower.currentPokemon.attack(this, follower, this.attackBuffer[follower.id]);
    console.log("debug : "+starterAtk.name);
    console.log("dmg : "+starterAtk.damage);
    starter.socket.send('{"action" : "round", "content" : {"1" : {"action" : "attack", "attackid" : "1", "attackLabel" : "'+starterAtk['name']+'", "damage" : "'+starterAtk.damage+'"}, "2" : {"action" : "attacked", "attackid" : "1","attackLabel" : "'+followerAtk['name']+'", "damage" : "'+followerAtk['damage']+'"}}}');
    follower.socket.send('{"action" : "round", "content" : {"1" : {"action" : "attacked", "attacked" : "1", "attackLabel" : "'+starterAtk['name']+'", "damage" : "'+starterAtk['damage']+'"}, "2" : {"action" : "attack", "attackid" : "1", "attackLabel" : "'+followerAtk['name']+'", "damage" : "'+followerAtk['damage']+'"}}}');

    console.log("attaque");

}

function getPokemons(user) {
    this.playerOne.currentPokemon = this.playerOne.pokemons[0];
    this.playerTwo.currentPokemon = this.playerTwo.pokemons[0];

   if(this.playerOne.id == user.id) 
        user.socket.send('{"action" : "setPokemon",'
                         +'"playerPokemonId"   : "'+this.playerOne.pokemons[0].refId+'",'
                         +'"playerPokemonName" : "'+this.playerOne.pokemons[0].name+'",'
                         +'"playerPokemonPv"   : "'+this.playerOne.pokemons[0].life+'",'
                         +'"ennemyPokemonId"   : "'+this.playerTwo.pokemons[0].refId+'",'
                         +'"ennemyPokemonName" : "'+this.playerTwo.pokemons[0].name+'",'
                         +'"ennemyPokemonPv"   : "'+this.playerTwo.pokemons[0].life+'",'
                         +'"atk1Label"         : "'+this.playerOne.pokemons[0].skills[1].name+'",'
                         +'"atk2Label"         : "'+this.playerOne.pokemons[0].skills[2].name+'",'
                         +'"atk3Label"         : "'+this.playerOne.pokemons[0].skills[3].name+'",'
                         +'"atk4Label"         : "'+this.playerOne.pokemons[0].skills[4].name+'"'
                         +'}');
   else
        user.socket.send('{"action" : "setPokemon",'
                         +'"playerPokemonId"   : "'+this.playerTwo.pokemons[0].refId+'",'
                         +'"playerPokemonName" : "'+this.playerTwo.pokemons[0].name+'",'
                         +'"playerPokemonPv"   : "'+this.playerTwo.pokemons[0].life+'",'
                         +'"ennemyPokemonId"   : "'+this.playerOne.pokemons[0].refId+'",'
                         +'"ennemyPokemonName" : "'+this.playerOne.pokemons[0].name+'",'
                         +'"ennemyPokemonPv"   : "'+this.playerOne.pokemons[0].life+'",'
                         +'"atk1Label"         : "'+this.playerTwo.pokemons[0].skills[1].name+'",'
                         +'"atk2Label"         : "'+this.playerTwo.pokemons[0].skills[2].name+'",'
                         +'"atk3Label"         : "'+this.playerTwo.pokemons[0].skills[3].name+'",'
                         +'"atk4Label"         : "'+this.playerTwo.pokemons[0].skills[4].name+'"'
                         +'}');

}

function joinRoom( user, socket) {
    if(this && this.available) {
        this.available = false;
        this.playerTwo = user;
        this.playerOne.socket.send('{"action" : "gameStarted", "roomid" : "'+this.id+'"}');
        this.playerTwo.socket.send('{"action" : "gameStarted", "roomid" : "'+this.id+'"}');
    }
}



//exports.join = join;
//exports.getPokemons = getPokemons;
exports.create = create;
//exports.addAttackToBuffer = addAttackToBuffer;
//exports.startRound = startRound;
//exports.playRound = playRound;
//exports.attackBuffer = attackBuffer;
