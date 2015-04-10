<?php
class SkyMazon_Customer_LoginController extends Mage_Core_Controller_Front_Action {
	public function indexAction() {
		$username = Mage::app ()->getRequest ()->getParam ( 'username' );
		$password = Mage::app ()->getRequest ()->getParam ( 'password' );
		$session = MagegetSingleton ( 'customer/session' );
		$session->login ( $username, $password );
		echo $customer->getName ();
	}
}