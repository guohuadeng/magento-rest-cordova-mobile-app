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
			if (($o->getType () == "field") || ($o->getType () == "file")) {
				$select [$selectid] = array (
						'option_id' => $o->getId (),
						'custom_option_type' => $o->getType (),
						'custom_option_title' => $o->getTitle (),
						'is_require' => $o->getIsRequire (),
						'price' => number_format ( Mage::helper ( 'directory' )->currencyConvert ( $o->getPrice (), $baseCurrency, $currentCurrency ), 2, '.', '' ),
						'price_type' => $o->getPriceType (),
						'sku' => $o->getSku (),
						'max_characters' => $o->getMaxCharacters () 
				);
			} else {
				$max_characters = $o->getMaxCharacters ();
				$optionid = 1;
				$options = array ();
				$values = $o->getValues ();
				foreach ( $values as $v ) {
					$options [$optionid] = $v->getData ();
					if(null!==$v->getData('price') && null!==$v->getData('default_price')){
						$options [$optionid]['price']=number_format ( Mage::helper ( 'directory' )->currencyConvert ( $v->getPrice (), $baseCurrency, $currentCurrency ), 2, '.', '' );
						$options [$optionid]['default_price']=number_format ( Mage::helper ( 'directory' )->currencyConvert ( $v->getDefaultPrice (), $baseCurrency, $currentCurrency ), 2, '.', '' );
					}
						
					
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
		if ($product->getOptions ())
			$has_custom_options = true;
		else
			$has_custom_options = false;
		$addtionatt=$this->_getAditional();
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
				'symbol' => Mage::app ()->getLocale ()->currency ( Mage::app ()->getStore ()->getCurrentCurrencyCode () )->getSymbol () ,
				'weight'=>$product->getWeight(),
				'additional'=>$addtionatt
		);
		echo json_encode ( $productdetail );
	}
	public function getPicListsAction() {
		$productId = ( int ) $this->getRequest ()->getParam ( 'product' );
		$_product = Mage::getModel ( "catalog/product" )->load ( $productid );
		$_images = Mage::getModel ( 'catalog/product' )->load ( $productId )->getMediaGalleryImages ();
		$images = array ();
		foreach ( $_images as $_image ) {
			$images [] = array (
					'url' => $_image->getUrl (),
					'position' => $_image->getPosition () 
			);
		}
		echo json_encode ( $images );
	}
	public function _getAditional(array $excludeAttr = array()) {
		$data = array ();
		$productId = ( int ) $this->getRequest ()->getParam ( 'productid' );
		$product = Mage::getModel ( "catalog/product" )->load ( $productid );
		$attributes = $product->getAttributes ();
		foreach ( $attributes as $attribute ) {
			if ($attribute->getIsVisibleOnFront () && ! in_array ( $attribute->getAttributeCode (), $excludeAttr )) {
				$value = $attribute->getFrontend ()->getValue ( $product );
				
				if (! $product->hasData ( $attribute->getAttributeCode () )) {
					$value = Mage::helper ( 'catalog' )->__ ( 'N/A' );
				} elseif (( string ) $value == '') {
					$value = Mage::helper ( 'catalog' )->__ ( 'No' );
				} elseif ($attribute->getFrontendInput () == 'price' && is_string ( $value )) {
					$value = Mage::app ()->getStore ()->convertPrice ( $value, true );
				}
				
				if (is_string ( $value ) && strlen ( $value )) {
					$data [$attribute->getAttributeCode ()] = array (
							'label' => $attribute->getStoreLabel (),
							'value' => $value,
							'code' => $attribute->getAttributeCode () 
					);
				}
			}
		}
		return $data;
	}
} 