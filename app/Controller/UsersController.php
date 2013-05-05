<?php
class UsersController extends AppController {
    public $helpers = array('Html', 'Form');
    public $components = array('RequestHandler');

    public function index() {
        //echo $this->RequestHandler->accepts();
    	//$this->layout = 'empty';
        $this->set('_serialize', $this->User->find('all'));

    }

    public function view($id = null) {
        $this->User->idFacebook = $id;
        if (!$this->User->exists())
            throw new NotFoundException(__('User invalide'));
        $this->set('user', $this->User->read(null, $id));
    }

    public function add() {
        if($this->request->is('post')) {
            $this->RequestHandler->addInputType('json', array('json_decode', true));
            $conditions = array(
                'User.idFacebook' => $this->request->data['idFacebook'],
            );
            if (!$this->User->hasAny($conditions)){
                $newUser = array(
                    'login' => $this->request->data['login'],
                    'idFacebook' => $this->request->data['idFacebook'],
                );
            $this->User->save($newUser);
            $this->set('user', $newUser);
            }
        }
    }

    public function connect($id = null) {
        $response = array();
        $conditions = array(
            'User.idFacebook' => $id,
        );
        if ($this->User->hasAny($conditions)){
            $response['action'] = "connected";
            $user = $this->User->find('first', array(
                    'recursive' => -1,
                    'conditions' => array('idFacebook' => $id),
                ));
            $response['login'] = $user['User']['login'];
            $response['idFacebook'] = $user['User']['idFacebook']; 
            $response['X'] = $user['User']['X'];
            $response['Y'] = $user['User']['Y'];
        } else {
            $response['action'] = "create";
            $response['idFacebook'] = $id;
            $response['login'] = "Unknown";
            $response['X'] = 30;
            $response['Y'] = 30;
        }



        $this->set('response', $response);
        
    }
    public function setPosition($id = null) {
        $this->RequestHandler->addInputType('json', array('json_decode', true));
        $this->User->id = $id;
        $this->User->read();
        $this->User->save($this->request->data);
        $response['Status'] = "OK";
        $this->set('response', $response);
        
    }
	public function login() {
	}

	public function logout() {
		$this->redirect($this->Auth->logout());
	}

}
?>
