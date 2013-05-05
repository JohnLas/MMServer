<!-- app/View/Users/add.ctp -->

<h1>Challenge un ami</h1>
<?php 
    echo $this->Form->create('UserSearch');
    echo $this->Form->input('field');
    echo $this->Form->end('Submit');


echo $this->Html->scriptBlock('$(function() {
        $( "#UserSearchField" ).autocomplete({
            source: "'.$this->Html->url(array('controller' => 'users', "action" =>"findFacebookFriends")).'"
        });
    });',array('inline' => false));


?>





<table>
    <tr>
        <th>Photo</th>
        <th>Nom</th>
        <th>Challenge</th>
    </tr>

    <!-- C'est ici que nous bouclons sur le tableau $posts afin d'afficher
    les informations des posts -->

    <?php foreach ($friends['data'] as $friend): ?>
    <tr>
        <td><img <?php echo "src=\"https://graph.facebook.com/".$friend['id']."/picture\"";?> /></td>
        <td><?php echo $friend['name']; ?></td>
        <td><?php echo $this->Html->link("Challenge!", array('controller' => 'challenges','action' => 'launchChallenge',$friend['id'])); ?></td>

    </tr>
    <?php endforeach; ?>

</table>