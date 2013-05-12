<?php
class PokemonReferencesController extends AppController {
    public function getReference($refId) {
        debug($this->PokemonReference->find('first'));
        return "ok";
    }
}
?>
