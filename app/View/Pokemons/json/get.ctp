<?php 
		$id = 0;
		$result = array();
		foreach ($pokemons as $pokemon) {
			$id++;
			$result['pokemon'.$id] = $pokemon['Pokemon'];
		};
		echo json_encode($result);
?>