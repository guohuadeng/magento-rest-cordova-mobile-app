<?php
class SkyMazon_RestConnect_IndexController extends Mage_Core_Controller_Front_Action {
	public function indexAction() {
	    Mage::app()->cleanCache();  
		$cmd = ($this->getRequest ()->getParam ( 'cmd' ))? ($this->getRequest ()->getParam ( 'cmd' )):'special_price';
		switch ($cmd) {
			case 'menu' :
				// ---------------------------------列出产品目录-BEGIN-------------------------------------//
				$_helper = Mage::helper ( 'catalog/category' );
				$_categories = $_helper->getStoreCategories ();
				$_categorylist=array();
				if (count ( $_categories ) > 0) {
					foreach ( $_categories as $_category ) {
						$_helper->getCategoryUrl ( $_category );
						$_categorylist[]['name']=$_category->getName ();
						$_categorylist[]['catid']=$_category->getId();
						$_categorylist[]['imageurl']=$_category->getImageUrl ();
						// Mage::getModel('catalog/category')->load($catId)->getImageUrl();
					}
				}
				echo json_encode($_categorylist);
				// ---------------------------------列出产品目录 END----------------------------------------//
				break;
			case 'catalog' :
				$categoryid = $this->getRequest ()->getParam ( 'categoryid' );
				// ----------------------------------取某个分类下的产品-BEGIN------------------------------//
				$category = Mage::getModel ( 'catalog/category' )->load ( $categoryid );
				$model = Mage::getModel ( 'catalog/product' ); // getting product model
				$productlist = array ();
				foreach ( $category->getProductCollection () as $product ) {
					// getting product object for particular product id,设置要显示商品的属性
					$_product = $model->load ( $product ['entity_id'] );
					$productlist [] ['name'] = $_product->getName ();
					$productlist [] ['price'] = $_product->getPrice ();
					$productlist [] ['special_price'] = $_product->getSpecialPrice ();
					$productlist [] ['thumbnail']=$_product->getThumbnailUrl();
					$productlist [] ['short_description']= $_product->getShortDescription();
					$productlist [] ['image']=$_product->getImageUrl();
					$productlist [] ['small_image']=$_product->getSmallImageUrl();
					$productlist [] ['description']=$_product->getDescription();
					$productlist [] ['product_url']=$_product->getProductUrl();
				}
				echo json_encode( $productlist );
				// ------------------------------取某个分类下的产品-END-----------------------------------//
				break;
			case 'daily_sale' :
				// ------------------------------首页 促销商品 BEGIN-------------------------------------//
				//初始化产品 Collection 对象
				echo 'is in';
				$page = ($this->getRequest ()->getParam ( 'page' ))? ($this->getRequest ()->getParam ( 'page' )):1;
				$limit = ($this->getRequest ()->getParam ( 'limit' ))? ($this->getRequest ()->getParam ( 'limit' )):5;
				$products = Mage::getResourceModel ( 'catalog/product_collection' );
				$products->addAttributeToSelect ('*');
				$products->addAttributeToFilter ( 'visibility', array (
						'neq' => 1 
				) );
				// 确保该产品是启用的
				$products->addAttributeToFilter ( 'status', 1 );
				$products->addAttributeToFilter ( 'special_price', array (
						'neq' => 0 
				) );
				$products->setCurPage ( $page )->setPageSize ( $limit );
				
				
				//$collection = Mage::getModel('catalog/product')->getCollection();
				// $model = Mage::getModel ( 'catalog/product' );
				// $productlist=array();
				// foreach ( $products->getProductCollection () as $product ) {
				// 	$_product = $model->load ( $product ['entity_id'] );
				// 	$productlist [] ['name'] = $_product->getName ();
				// 	$productlist [] ['price'] = $_product->getPrice ();
				// 	$productlist [] ['special_price'] = $_product->getSpecialPrice ();
				// 	$productlist [] ['thumbnail']=$_product->getThumbnailUrl();
				// 	$productlist [] ['short_description']= $_product->getShortDescription();
				// 	$productlist [] ['image']=$_product->getImageUrl();
				// 	$productlist [] ['small_image']=$_product->getSmallImageUrl();
				// 	$productlist [] ['description']=$_product->getDescription();
				// 	$productlist [] ['product_url']=$_product->getProductUrl();
				// }
				// var_dump ( $productlist );
				var_dump ( $products->load () );

				// ------------------------------首页 促销商品 END-------------------------------------//
				break;
			case 'coming_soon' :
				// ------------------------------首页 预特价商品 BEGIN------------------------------//
				$todayDate = Mage::app ()->getLocale ()->date ()->toString ( Varien_Date::DATETIME_INTERNAL_FORMAT );
				$_products = Mage::getModel ( 'catalog/product' )->getCollection ()->addAttributeToSelect ( array (
						'name',
						'special_price',
						'news_from_date' 
				) )->addAttributeToFilter ( 'news_from_date', array (
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
				) )->addAttributeToSort ( 'news_from_date', 'desc' )->setPage ( 1, 4 );
				var_dump ( $_products );
				// ------------------------------首页 预特价商品 END--------------------------------//
				break;
			case 'best_seller' :
				// -------------------------------首页 特卖商品 BEGIN------------------------------//
				$todayDate = Mage::app ()->getLocale ()->date ()->toString ( Varien_Date::DATETIME_INTERNAL_FORMAT );
				$collection = Mage::getResourceModel ( 'catalog/product_collection' );
				Mage::getSingleton ( 'catalog/product_status' )->addVisibleFilterToCollection ( $collection );
				Mage::getSingleton ( 'catalog/product_visibility' )->addVisibleInCatalogFilterToCollection ( $collection );
				$collection = $this->_addProductAttributesAndPrices ( $collection )->addStoreFilter ()->addAttributeToFilter ( 'special_from_date', array (
						'date' => true,
						'to' => $todayDate 
				) )->addAttributeToFilter ( 'special_to_date', array (
						'or' => array (
								0 => array (
										'date' => true,
										'from' => $todayDate 
								),
								1 => array (
										'is' => new Zend_Db_Expr ( 'null' ) 
								) 
						) 
				), 'left' )->addAttributeToSort ( 'special_from_date', 'desc' )->setPageSize ( $this->getProductsCount () )->setCurPage ( 1 );
				$this->setProductCollection ( $collection );
				// -------------------------------首页 特卖商品 END------------------------------//
				break;
			default :
				echo 'your request was wrong';
				break;
		}
	}
}