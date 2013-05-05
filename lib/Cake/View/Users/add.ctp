<!-- app/View/Users/add.ctp -->
<div class="users form">
<?php echo $this->Form->create('User');?>
    <fieldset>
        <legend><?php echo __('Ajouter User'); ?></legend>
        <?php 
		echo $this->Form->input('idFacebook');
        echo $this->Form->input('nom');
        echo $this->Form->input('prenom');
    ?>
    </fieldset>
<?php echo $this->Form->end(__('Ajouter'));?>
</div>