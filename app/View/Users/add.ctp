<!-- app/View/Users/add.ctp -->
<div class="users form">
<?php echo $this->Form->create('User');?>
    <fieldset>
        <legend><?php echo __('Ajouter Utilisateur'); ?></legend>
        <?php 
			echo $this->Form->input('idFacebook');
	        echo $this->Form->input('login');
    	?>
    </fieldset>
<?php echo $this->Form->end(__('Ajouter'));?>
</div>