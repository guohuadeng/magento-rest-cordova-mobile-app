<?php

class SkyMazon_RestConnect_IndexController extends Mage_Core_Controller_Front_Action {

	public function indexAction() {

		Mage::app ()->cleanCache ();

		$cmd = ($this->getRequest ()->getParam ( 'cmd' )) ? ($this->getRequest ()->getParam ( 'cmd' )) : 'daily_sale';

		switch ($cmd) {

			case 'menu' : // OK

			              // ---------------------------------列出产品目录-BEGIN-------------------------------------//

				$_helper = Mage::helper ( 'catalog/category' );

				$_categories = $_helper->getStoreCategories ();

				$_categorylist = array ();

				if (count ( $_categories ) > 0) {

					foreach ( $_categories as $_category ) {

						$_helper->getCategoryUrl ( $_category );

						$_categorylist [] = array (
						
								'category_id' => $_category->getId (),

								'name' => $_category->getName (),
								
								'is_active' => $_category->getIsActive(),
								
								'position ' => $_category->getPosition(),
								
								'level ' => $_category->getLevel(),

								'url_key' => Mage::getModel ( 'catalog/category' )->load ( $_category->getId () )->getUrlPath (),
								
								'thumbnail_url' => Mage::getModel ( 'catalog/category' )->load ( $_category->getId () )->getThumbnailUrl (),
								'thumbnail_url' => $_category->getThumbnailUrl (),
								
								'image_url' => Mage::getModel ( 'catalog/category' )->load ( $_category->getId () )->getImageUrl (),

								'children' => Mage::getModel ( 'catalog/category' )->load ( $_category->getId () )->getAllChildren()

						);

						// $_categorylist []['name'] = $_category->getName ();

						// $_categorylist []['catid'] = $_category->getId ();

						// $_categorylist[]['imageurl']=$_category->getImageUrl ();

						// $_categorylist []['imageurl'] = Mage::getModel ( 'catalog/category' )->load ( $_category->getId () )->getImageUrl ();

					}

				}

				echo json_encode ( $_categorylist );

				// ---------------------------------列出产品目录 END----------------------------------------//

				break;

			case 'catalog' : // OK

				$categoryid = $this->getRequest ()->getParam ( 'categoryid' );

				$page = ($this->getRequest ()->getParam ( 'page' )) ? ($this->getRequest ()->getParam ( 'page' )) : 1;

				$limit = ($this->getRequest ()->getParam ( 'limit' )) ? ($this->getRequest ()->getParam ( 'limit' )) : 5;

				$order = ($this->getRequest ()->getParam ( 'order' )) ? ($this->getRequest ()->getParam ( 'order' )) : 'entity_id';

				$dir = ($this->getRequest ()->getParam ( 'dir' )) ? ($this->getRequest ()->getParam ( 'dir' )) : 'desc';

				// ----------------------------------取某个分类下的产品-BEGIN------------------------------//

				$category = Mage::getModel ( 'catalog/category' )->load ( $categoryid );

				$model = Mage::getModel ( 'catalog/product' ); // getting product model

				$collection = $category->getProductCollection ()->addAttributeToSort ( $order, $dir )->setPage ( $page, $limit );

				$productlist = array ();

				foreach ( $collection as $product ) {

					// getting product object for particular product id,设置要显示商品的属性

					$_product = $model->load ( $product ['entity_id'] );

					$productlist [] = array (

							'entity_id' => $_product->getId (),

							'sku' => $_product->getSku (),

							'name' => $_product->getName (),

							'news_from_date' => $_product->getNewsFromDate (),

							'news_to_date' => $_product->getNewsToDate (),

							'special_from_date' => $_product->getSpecialFromDate (),

							'special_to_date' => $_product->getSpecialToDate (),

							'image_url' => $_product->getImageUrl (),

							'url_key' => $_product->getProductUrl (),

							'regular_price_with_tax' => Mage::helper ( 'directory' )->currencyConvert ( $_product->getPrice (), 'CNY', 'USD' ),

							'final_price_with_tax' => Mage::helper ( 'directory' )->currencyConvert ( $_product->getSpecialPrice (), 'CNY', 'USD' ) 

					);

					// $productlist ['name'] [] = $_product->getName ();

					// $productlist ['price'] [] = $_product->getPrice ();

					// $productlist ['special_price'] [] = $_product->getSpecialPrice ();

					// $productlist ['thumbnail'] [] = $_product->getThumbnailUrl ();

					// $productlist ['short_description'] [] = $_product->getShortDescription ();

					// $productlist ['image'] [] = $_product->getImageUrl ();

					// $productlist ['small_image'] [] = $_product->getSmallImageUrl ();

					// $productlist ['description'] [] = $_product->getDescription ();

					// $productlist ['product_url'] = $_product->getProductUrl ();

				}

				echo json_encode ( $productlist );

				// ------------------------------取某个分类下的产品-END-----------------------------------//

				break;

			case 'coming_soon' : // 数据ok

			                     // ------------------------------首页 促销商品 BEGIN-------------------------------------//

			                     // 初始化产品 Collection 对象

				$page = ($this->getRequest ()->getParam ( 'page' )) ? ($this->getRequest ()->getParam ( 'page' )) : 1;

				$limit = ($this->getRequest ()->getParam ( 'limit' )) ? ($this->getRequest ()->getParam ( 'limit' )) : 5;

				// $todayDate = Mage::app ()->getLocale ()->date ()->toString ( Varien_Date::DATETIME_INTERNAL_FORMAT );

				$tomorrow = mktime ( 0, 0, 0, date ( 'm' ), date ( 'd' ) + 1, date ( 'y' ) );

				$dateTomorrow = date ( 'm/d/y', $tomorrow );

				$tdatomorrow = mktime ( 0, 0, 0, date ( 'm' ), date ( 'd' ) + 3, date ( 'y' ) );

				$tdaTomorrow = date ( 'm/d/y', $tdatomorrow );

				$_productCollection = Mage::getModel ( 'catalog/product' )->getCollection ();

				$_productCollection->addAttributeToSelect ( '*' )->addAttributeToFilter ( 'visibility', array (

						'neq' => 1 

				) )->addAttributeToFilter ( 'status', 1 )->addAttributeToFilter ( 'special_price', array (

						'neq' => 0 

				) )->addAttributeToFilter ( 'special_from_date', array (

						'date' => true,

						'to' => $dateTomorrow 

				) )->addAttributeToFilter ( array (

						array (

								'attribute' => 'special_to_date',

								'date' => true,

								'from' => $tdaTomorrow 

						),

						array (

								'attribute' => 'special_to_date',

								'null' => 1 

						) 

				) )->setPage ( $page, $limit );

				$products = $_productCollection->getItems ();

				$productlist = array ();

				foreach ( $products as $product ) {

					// echo $product->getName ();

					$productlist [] = array (

							'entity_id' => $product->getId (),

							'sku' => $product->getSku (),

							'name' => $product->getName (),

							'news_from_date' => $product->getNewsFromDate (),

							'news_to_date' => $product->getNewsToDate (),

							'special_from_date' => $product->getSpecialFromDate (),

							'special_to_date' => $product->getSpecialToDate (),

							'image_url' => $product->getImageUrl (),

							'url_key' => $product->getProductUrl (),

							'regular_price_with_tax' => Mage::helper ( 'directory' )->currencyConvert ( $product->getPrice (), 'CNY', 'USD' ),

							'final_price_with_tax' => Mage::helper ( 'directory' )->currencyConvert ( $product->getSpecialPrice (), 'CNY', 'USD' ) 

					);

				}

				echo json_encode ( $productlist );

				// ------------------------------首页 促销商品 END-------------------------------------//

				break;

			case 'best_seller' : // OK

			                     // ------------------------------首页 预特价商品 BEGIN------------------------------//

				$page = ($this->getRequest ()->getParam ( 'page' )) ? ($this->getRequest ()->getParam ( 'page' )) : 1;

				$limit = ($this->getRequest ()->getParam ( 'limit' )) ? ($this->getRequest ()->getParam ( 'limit' )) : 5;

				$todayDate = Mage::app ()->getLocale ()->date ()->toString ( Varien_Date::DATETIME_INTERNAL_FORMAT );

				$_products = Mage::getModel ( 'catalog/product' )->getCollection ()->addAttributeToSelect ( '*'/* array (

						'name',

						'special_price',

						'news_from_date' 

				) */ )->addAttributeToFilter ( 'news_from_date', array (

						'or' => array (

								0 => array (

										'date' => true,

										'to' => $todayDate 

								),

								1 => array (

										'is' => new Zend_Db_Expr ( 'null' ) 

								) 

						) 

				), 'left' )->addAttributeToFilter ( 'news_to_date', array (

						'or' => array (

								0 => array (

										'date' => true,

										'from' => $todayDate 

								),

								1 => array (

										'is' => new Zend_Db_Expr ( 'null' ) 

								) 

						) 

				), 'left' )->addAttributeToFilter ( array (

						array (

								'attribute' => 'news_from_date',

								'is' => new Zend_Db_Expr ( 'not null' ) 

						),

						array (

								'attribute' => 'news_to_date',

								'is' => new Zend_Db_Expr ( 'not null' ) 

						) 

				) )->addAttributeToFilter ( 'visibility', array (

						'in' => array (

								2,

								4 

						) 

				) )->addAttributeToSort ( 'news_from_date', 'desc' )->setPage ( $page, $limit );

				$products = $_products->getItems ();

				$productlist = array ();

				foreach ( $products as $product ) {

					// echo $product->getName ();

					$productlist [] = array (

							'entity_id' => $product->getId (),

							'sku' => $product->getSku (),

							'name' => $product->getName (),

							'news_from_date' => $product->getNewsFromDate (),

							'news_to_date' => $product->getNewsToDate (),

							'image_url' => $product->getImageUrl (),

							'url_key' => $product->getProductUrl (),

							'regular_price_with_tax' => Mage::helper ( 'directory' )->currencyConvert ( $product->getPrice (), 'CNY', 'USD' ),

							'final_price_with_tax' => Mage::helper ( 'directory' )->currencyConvert ( $product->getSpecialPrice (), 'CNY', 'USD' ) 

					);

				}

				echo json_encode ( $productlist );

				

				// ------------------------------首页 预特价商品 END--------------------------------//

				break;

			case 'daily_sale' : // 数据OK

			                    // -------------------------------首页 特卖商品 BEGIN------------------------------//

				$page = ($this->getRequest ()->getParam ( 'page' )) ? ($this->getRequest ()->getParam ( 'page' )) : 1;

				$limit = ($this->getRequest ()->getParam ( 'limit' )) ? ($this->getRequest ()->getParam ( 'limit' )) : 5;

				$todayDate = Mage::app ()->getLocale ()->date ()->toString ( Varien_Date::DATETIME_INTERNAL_FORMAT );

				$tomorrow = mktime ( 0, 0, 0, date ( 'm' ), date ( 'd' ) + 1, date ( 'y' ) );

				$dateTomorrow = date ( 'm/d/y', $tomorrow );

				// $collection = Mage::getResourceModel ( 'catalog/product_collection' );

				$collection = Mage::getModel ( 'catalog/product' )->getCollection ();

				$collection->/* addStoreFilter ()-> */addAttributeToSelect ( '*' )->addAttributeToFilter ( 'special_price', array (

						'neq' => "0" 

				) )->addAttributeToFilter ( 'special_from_date', array (

						'date' => true,

						'to' => $todayDate 

				) )->addAttributeToFilter ( array (

						array (

								'attribute' => 'special_to_date',

								'date' => true,

								'from' => $dateTomorrow 

						),

						array (

								'attribute' => 'special_to_date',

								'null' => 1 

						) 

				) )->setPage ( $page, $limit );

				$products = $collection->getItems ();

				$productlist = array ();

				foreach ( $products as $product ) {

					// echo $product->getName ();

					$productlist [] = array (

							'entity_id' => $product->getId (),

							'sku' => $product->getSku (),

							'name' => $product->getName (),

							'news_from_date' => $product->getNewsFromDate (),

							'news_to_date' => $product->getNewsToDate (),

							'special_from_date' => $product->getSpecialFromDate (),

							'special_to_date' => $product->getSpecialToDate (),

							'image_url' => $product->getImageUrl (),

							'url_key' => $product->getProductUrl (),

							'regular_price_with_tax' => Mage::helper ( 'directory' )->currencyConvert ( $product->getPrice (), 'CNY', 'USD' ),

							'final_price_with_tax' => Mage::helper ( 'directory' )->currencyConvert ( $product->getSpecialPrice (), 'CNY', 'USD' ) 

					);

				}

				echo json_encode ( $productlist );

				// -------------------------------首页 特卖商品 END------------------------------//

				break;

			default :

				echo 'Your request was wrong.';

				// echo $currency_code = Mage::app()->getStore()->getCurrentCurrencyCode();

				// echo Mage::app()->getLocale()->currency(Mage::app()->getStore()->getCurrentCurrencyCode())->getSymbol();

				break;

		}

	}

}