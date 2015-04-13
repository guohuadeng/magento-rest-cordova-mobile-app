<?php
class SkyMazon_RestConnect_CustomerController extends Mage_Core_Controller_Front_Action {
	public function statusAction() {
		$customerinfo = array ();
		if (Mage::getSingleton ( 'customer/session' )->isLoggedIn ()) {
			$customer = Mage::getSingleton ( 'customer/session' )->getCustomer ();
			$customerinfo = array (
					'name' => $customer->getName (),
					'email' => $customer->getEmail (),
					// 'avatar' => 'http://skymazon.sunpop.cn/index.php/admin/customer/viewfile/file/L00vZS9NZUNvbnRyb2xYWExVc2VyVGlsZS5qcGc,/key/2b383809c145646494d8129857d59cc4/'
					'avatar' => $customer->getMyAvatar (),
					'tel' => $customer->getDefaultMobileNumber () 
			);
			echo json_encode ( $customerinfo );
		} else
			echo 'false';
	}
	public function loginAction() {
		$session = Mage::getSingleton ( 'customer/session' );
		if (Mage::getSingleton ( 'customer/session' )->isLoggedIn ()) {
			$session->logout ( $username, $password );
		}
		$username = Mage::app ()->getRequest ()->getParam ( 'username' );
		$password = Mage::app ()->getRequest ()->getParam ( 'password' );		
		$session->login ( $username, $password );
		echo $this->statusAction ();
	}
} 