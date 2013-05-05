<!-- Fichier: /app/View/Posts/index.ctp -->

<h1>Users</h1>
<?php echo $this->Html->link('Ajouter un user', array('controller' => 'users', 'action' => 'add')); ?>
<table>
    <tr>
        <th>Id</th>
        <th>idFacebook</th>
		<th>prenom</th>
        <th>nom</th>
    </tr>

    <!-- C'est ici que nous bouclons sur le tableau $posts afin d'afficher
    les informations des posts -->

    <?php foreach ($users as $user): ?>
    <tr>
        <td><?php echo $user['User']['id']; ?></td>
        <td><?php echo $user['User']['idFacebook']; ?></td>
		<td><?php echo $user['User']['prenom']; ?></td>
        <td><?php echo $user['User']['nom']; ?></td>
    </tr>
    <?php endforeach; ?>

</table>