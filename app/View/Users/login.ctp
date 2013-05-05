<h1>Connexion Facebook</h1>
<div id="fb-root"></div>
<a href="#" class="facebookConnect" onclick="login('<?php echo $this->Html->url(array('action' => 'facebook'));?>')" >Se connecter</a>
<?php echo $this->Html->url(array('action' => 'facebook'));?>
<?php echo $this->Html->script('facebook'); ?>