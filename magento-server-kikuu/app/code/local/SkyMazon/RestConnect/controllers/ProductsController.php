<?php
class SkyMazon_RestConnect_ProductsController extends Mage_Core_Controller_Front_Action {
	public function getcustomeroptionAction() {
		$productid = $this->getRequest ()->getParam ( 'productid' );
		$product = Mage::getModel ( "catalog/product" )->load ( $productid );
		$selectid = 1;
		$select = array ();
		foreach ( $product->getOptions () as $o ) {
			$optionid = 1;
			$values = $o->getValues ();
			$options = array ();
			foreach ( $values as $v ) {
				$options [$optionid] = $v->getData ();
				$optionid ++;
			}
			$select [$selectid] = array (
					'custom_option_id' => $selectid,
					'custom_option_type' => $o->getType (),
					'custom_option_title' => $o->getTitle (),
					'custom_option_value' => $options 
			);
			$selectid ++;
			// echo "----------------------------------<br/>";
		}
		echo json_encode ( $select );
	}
} 