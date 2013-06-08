<?php
class PokemonsController extends AppController {
	var $uses = array('PokemonReference','Pokemon');
 	public $components = array('RequestHandler');

	public function create() {
		if($this->request->is('post')) {
			$this->RequestHandler->addInputType('json', array('json_decode', true));
			$userId = $this->request->data['idFacebook'];
			$refId = $this->request->data['idPokemon'];
		}
		$reference = $this->PokemonReference->find('first', array('conditions' => array('id' => $refId)));
		$newPokemon = $reference['PokemonReference'];
		$newPokemon['refId'] = $newPokemon['id'];
		unset($newPokemon['id']);
		$newPokemon['userId'] = $userId;
		$this->set('pokemon', $this->Pokemon->save($newPokemon));
	}



	public function get($userId) {
		$pkms = $this->Pokemon->find('all', array('conditions' => array('userId' => $userId)));
		$pokemons = array();
		foreach ($pkms as $pokemon) {
			$pokemon['Pokemon']["attack1"] = "attack1";
			$pokemon['Pokemon']["attack2"] = "attack2";
			$pokemon['Pokemon']["attack3"] = "attack3";
			$pokemon['Pokemon']["attack4"] = "attack4";
			$pokemons[] = $pokemon;
		}
		$this->set('pokemons', $pokemons);
	}

}
?>
