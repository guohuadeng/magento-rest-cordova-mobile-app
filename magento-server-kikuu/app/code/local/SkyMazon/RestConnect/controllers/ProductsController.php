<?php
class SkyMazon_RestConnect_ProductsController extends Mage_Core_Controller_Front_Action {
	public function getcustomoptionAction() {
		$baseCurrency = Mage::app ()->getStore ()->getBaseCurrency ()->getCode ();
		$currentCurrency = Mage::app ()->getStore ()->getCurrentCurrencyCode ();
		$productid = $this->getRequest ()->getParam ( 'productid' );
		$product = Mage::getModel ( "catalog/product" )->load ( $productid );
		$selectid = 1;
		$select = array ();
		foreach ( $product->getOptions () as $o ) {
			if (($o->getType () == "field") || ($o->getType () =="file")) {
				$select [$selectid] = array (
						'option_id' => $o->getId (),
						'custom_option_type' => $o->getType (),
						'custom_option_title' => $o->getTitle (),
						'is_require' => $o->getIsRequire (),
						'price' => number_format ( Mage::helper ( 'directory' )->currencyConvert ( $o->getPrice (), $baseCurrency, $currentCurrency ), 2, '.', '' ),
						'price_type'=>$o->getPriceType(),
						'sku'=>$o->getSku(),
						'max_characters' => $o->getMaxCharacters (),
				);
			} else {
				$max_characters = $o->getMaxCharacters ();
				$optionid = 1;
				$options = array ();
				$values = $o->getValues ();
				foreach ( $values as $v ) {
					$options [$optionid] = $v->getData ();
					$optionid ++;
				}
				$select [$selectid] = array (
						'option_id' => $o->getId (),
						'custom_option_type' => $o->getType (),
						'custom_option_title' => $o->getTitle (),
						'is_require' => $o->getIsRequire (),
						'price' => number_format ( Mage::helper ( 'directory' )->currencyConvert ( $o->getFormatedPrice (), $baseCurrency, $currentCurrency ), 2, '.', '' ),
						'max_characters' => $max_characters,
						'custom_option_value' => $options 
				);
			}
			
			$selectid ++;
			// echo "----------------------------------<br/>";
		}
		echo json_encode ( $select );
	}
	public function getproductdetailAction() {
		$productdetail = array ();
		$baseCurrency = Mage::app ()->getStore ()->getBaseCurrency ()->getCode ();
		$currentCurrency = Mage::app ()->getStore ()->getCurrentCurrencyCode ();
		$productid = $this->getRequest ()->getParam ( 'productid' );
		$product = Mage::getModel ( "catalog/product" )->load ( $productid );
		if ($product->getOptions())
				$has_custom_options = true;
		else
				$has_custom_options = false;
		
		$productdetail = array (
				'entity_id' => $product->getId (),
				'sku' => $product->getSku (),
				'name' => $product->getName (),
				'news_from_date' => $product->getNewsFromDate (),
				'news_to_date' => $product->getNewsToDate (),
				'special_from_date' => $product->getSpecialFromDate (),
				'special_to_date' => $product->getSpecialToDate (),
				'image_url' => $product->getImageUrl (),
				'url_key' => $product->getProductUrl (),
				'is_in_stock' => $product->isAvailable (),
				'has_custom_options' => $has_custom_options,
				'regular_price_with_tax' => number_format ( Mage::helper ( 'directory' )->currencyConvert ( $product->getPrice (), $baseCurrency, $currentCurrency ), 2, '.', '' ),
				'final_price_with_tax' => number_format ( Mage::helper ( 'directory' )->currencyConvert ( $product->getSpecialPrice (), $baseCurrency, $currentCurrency ), 2, '.', '' ),
				'description' => nl2br ( $product->getDescription () ),
				'symbol' => Mage::app ()->getLocale ()->currency ( Mage::app ()->getStore ()->getCurrentCurrencyCode () )->getSymbol () 
		);
		echo json_encode ( $productdetail );
	}

	public function getPicListsAction(){
		$productId = ( int ) $this->getRequest ()->getParam ( 'product' );
		$_product=Mage::getModel ( "catalog/product" )->load ( $productid );
		$_images = Mage::getModel('catalog/product')->load($productId)->getMediaGalleryImages();
		$images=array();
		foreach ($_images as $_image){
			$images[]=array('url'=>$_image->getUrl(),
					'position'=>$_image->getPosition()
			);
		}
		//var_dump($images);
		echo json_encode($images);
	}
} 