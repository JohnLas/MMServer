<?php
class Pokemon extends AppModel {
	public $name = 'Pokemon';
	public $primaryKey = 'id';
	public $BelongsTo = array(
        'PokemonReference' => array(
            'className'    => 'PokemonReference',
            'foreignKey'   => 'refId'
        ),
        'User' => array(
            'className'    => 'User',
            'foreignKey'   => 'userId'
        )
    );
}
?>