<?php

class SkyMazon_RestConnect_CustomerController extends Mage_Core_Controller_Front_Action {

	public function statusAction() {

		// echo 'HelloWorld!';

		// $categoryid = $this->getRequest ()->getParam ( 'categoryid' );

		// $page = ($this->getRequest ()->getParam ( 'page' )) ? ($this->getRequest ()->getParam ( 'page' )) : 1;

		// $limit = ($this->getRequest ()->getParam ( 'limit' )) ? ($this->getRequest ()->getParam ( 'limit' )) : 5;

		// echo 'enter your key';

		// if (! $this->getRequest ()->getParam ( 'q', false )) {

		// $this->getResponse ()->setRedirect ( Mage::getSingleton ( 'core/url' )->getBaseUrl () );

		// }

		

		// var_dump ( $this->getResponse ()->setBody ( $this->getLayout ()->createBlock ( 'catalogsearch/autocomplete' )->toHtml () ) );

		$customerinfo = array ();

		if (Mage::getSingleton ( 'customer/session' )->isLoggedIn ()) {

			$customer = Mage::getSingleton ( 'customer/session' )->getCustomer ();

			$customerinfo = array (

					'name' => $customer->getName (),

					'email' => $customer->getEmail (), 

					'avatar' => 'http://skymazon.sunpop.cn/index.php/admin/customer/viewfile/file/L00vZS9NZUNvbnRyb2xYWExVc2VyVGlsZS5qcGc,/key/2b383809c145646494d8129857d59cc4/' 

			);

			echo json_encode ( $customerinfo );

		} else

			echo 'false';

	}

} 