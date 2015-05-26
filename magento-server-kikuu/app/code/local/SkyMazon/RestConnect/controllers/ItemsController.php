<?php
class SkyMazon_RestConnect_ItemsController extends Mage_Core_Controller_Front_Action {
	protected $_keepFrame = true;
	protected $_keepAspectRatio = true; // false stretch the image
	public function getItemsAction() {
		echo json_encode ( $this->_getItems () );
		// var_dump($this->_getItems ());
	}
	public function getSortingListAction(){
		echo json_decode($this->_getSortingList());
	}
	//min=29022&max=95032&ajaxcatalog=true&dir=asc&order=weight

	public function restApiAction(){
		$_filters=$this->getRequest()->getParams();
		//$server=Mage::getSingleton('api/server');
		$filter = Mage::getModel('core/input_filter');
		$filter->setFilters(/* $this->_filters */);
		$filter->setData( $filter->filter($data) );
		
		$_filters = Mage::getSingleton('Mage_Catalog_Block_Layer_State')->getActiveFilters();
	
		foreach ($_filters as $filter) {
			$filterData = $filter->getData();	
			//var_dump($filterData['filter']->getRequestVar());
			//var_dump($filterData['value']);
			if ($key && $val) {
				$product_collection->addAttributeToFilter($key, array('in' => $val));
			}
		}
		var_dump($product_collection);
	
	}
	private function _getProductImageType($product) {
		$imageType = 'image';
		$itemData = $product->getData ();
		if (isset ( $itemData ['image'] )) {
			$imageType = 'image';
		} else if (isset ( $itemData ['small_image'] )) {
			$imageType = 'small_image';
		} else if (isset ( $itemData ['thumbnail'] )) {
			$imageType = 'thumbnail';
		}
		return $imageType;
	}
	public function _HasOptions($product) {
		if (! $product->isSaleable ()) {
			return false;
		} else if ($product->getHasOptions ()) {
			return true;
		} else {
			return $product->getTypeInstance ( true )->hasOptions ( $product );
		}
	}
	public function _getItemBaseInfo($product) {
		$baseCurrency = Mage::app ()->getStore ()->getBaseCurrency ()->getCode ();
		$currentCurrency = Mage::app ()->getStore ()->getCurrentCurrencyCode ();
		$helper = Mage::helper ( 'catalog/image' );
		$helper->init ( $product, $this->_getProductImageType ( $product ) )->keepAspectRatio ( $this->_keepAspectRatio )->keepFrame ( $this->_keepFrame );
		$item = array ();
		$item ['item_id'] = $product->getId ();
		$item ['item_title'] = $product->getName ();
		$item ['item_url'] = $product->getProductUrl ();
		$item ['cid'] = $product->getCategoryIds ();
		$item ['qty'] = $product->getStockItem ()->getQty ();
		$item ['special_from_date'] = $product->getSpecialFromDate ();
		$item ['special_to_date'] = $product->getSpecialToDate ();
		$item ['regular_price_with_tax'] = number_format ( Mage::helper ( 'directory' )->currencyConvert ( $product->getPrice (), $baseCurrency, $currentCurrency ), 2, '.', '' );
		$item ['final_price_with_tax'] = number_format ( Mage::helper ( 'directory' )->currencyConvert ( $product->getSpecialPrice (), $baseCurrency, $currentCurrency ), 2, '.', '' );
		$item ['symbol'] = Mage::app ()->getLocale ()->currency ( Mage::app ()->getStore ()->getCurrentCurrencyCode () )->getSymbol ();
		$item ['thumbnail_pic_url'] = ( string ) $helper->resize ( $this->thumbnail_with, $this->thumbnail_height );
		$item ['main_pic_url'] = ( string ) $helper->resize ( $this->main_with, $this->main_height );
		$item ['is_virtual'] = $product->isVirtual ();
		$item ['item_status'] = $product->isSaleable () ? 'instock' : 'outofstock';
		if (! $product->getRatingSummary ()) {
			Mage::getModel ( 'review/review' )->getEntitySummary ( $product, Mage::app ()->getStore ()->getId () );
		}
		$item ['allow_add_to_cart'] = ! $this->_HasOptions ( $product );
		$item ['rating_score'] = round ( ( int ) $product->getRatingSummary ()->getRatingSummary () / 20 );
		$item ['rating_count'] = $product->getRatingSummary ()->getReviewsCount ();
		$item ['sales_type'] = ($product->isInStock ()) ? 'stock' : 'distribute';
		$item ['qty_min_unit'] = 1;
		$stockItem = $product->getStockItem ();
		if ($stockItem) {
			if ($stockItem->getMinSaleQty () && $stockItem->getMinSaleQty () > 0) {
				$item ['qty_min_unit'] = $stockItem->getMinSaleQty ();
			}
		}
		$item ['item_type'] = $product->getTypeId ();
		return $item;
	}
	public function _getItems() {
		try {
			$cid = $this->getRequest ()->getParam ( 'cid', false );
			$query = str_replace ( '%20', ' ', $this->getRequest ()->getParam ( 'query', '' ) );
			$pageNo = $this->getRequest ()->getParam ( 'page_no', 1 );
			$pageSize = $this->getRequest ()->getParam ( 'page_size', 20 );
			$itemIds = $this->getRequest ()->getParam ( 'item_ids', false );
			$orderBy = $this->getRequest ()->getParam ( 'order_by', false );
			$orderBy = $orderBy && strpos ( $orderBy, ':' ) > 0 ? $orderBy : 'postion:desc';
			list ( $order, $direction ) = explode ( ':', $orderBy, 2 );
			var_dump($direction);
			var_dump($order);
			if ($itemIds && trim ( $itemIds )) {
				// get by item ids
				$products = $this->getSpecifiedProducts ( $itemIds, $pageNo, $pageSize, $order, $direction );
			} else if (( int ) $this->getRequest ()->getParam ( 'is_specials', 0 )) {
				// get Special Products
				$products = $this->getSpecialProducts ( $pageNo, $pageSize, $order, $direction );
			} else if (strlen ( $query ) || (isset ( $_POST ['query'] ) && ! $cid)) {
				// get by query
				$products = $this->getProductsByQuery ( $query, $pageNo, $pageSize, $order, $direction );
			} else if ($cid == - 1) {
				// get all products
				$products = $this->getAllProducts ( $pageNo, $pageSize, $order, $direction );
			} else {
				// get by category
				$products = $this->getProductsByCategory ( $cid, $pageNo, $pageSize, $order, $direction );
			}
			return array (
					true,
					'0x0000',
					$products 
			);
		} catch ( Exception $e ) {
			return array (
					false,
					'0x0013',
					$e->getMessage () 
			);
		}
	}
	private function getSpecifiedProducts($ids, $pageNo, $pageSize, $order, $direction) {
		$collection = Mage::getResourceModel ( 'catalog/product_collection' )->addAttributeToSelect ( Mage::getSingleton ( 'catalog/config' )->getProductAttributes () )->addMinimalPrice ()->addFinalPrice ()->addTaxPercents ()->setCurPage ( $pageNo )->setPageSize ( $pageSize );
		
		if (strlen ( $ids )) {
			is_string ( $ids ) && $ids = explode ( ',', $ids );
			$count = count ( $ids );
			$start = max ( $pageNo - 1, 0 ) * $pageSize;
			$itemIds = array_splice ( $ids, $start, $pageSize );
			$collection->addIdFilter ( $itemIds );
		} else {
			return array (
					'items' => array (),
					'total_results' => 0 
			);
		}
		
		$collection->load ();
		$productList = $collection->getItems ();
		
		$items = array ();
		$sortOrder = array ();
		foreach ( $productList as $key => $product ) {
			if ($product->getId ()) {
				$items [$key] = $this->_getItemBaseInfo ( $product );
				$sortOrder [] = array_search ( $product->getId (), $itemIds );
			}
		}
		array_multisort ( $sortOrder, SORT_ASC, $items );
		
		$products = array ();
		$products ['items'] = $items;
		$products ['total_results'] = $count;
		return $products;
	}
	private function getSpecialProducts($pageNo, $pageSize, $order, $direction) {
		return $this->getAllProducts ( $pageNo, $pageSize, $order, $direction, true );
	}
	private function getAllProducts($pageNo, $pageSize, $order, $direction, $specials = false) {
		$collection = Mage::getSingleton ( 'catalog/layer' )->setCurrentCategory ( Mage::app ()->getStore ()->getRootCategoryId () )->getProductCollection ()->setCurPage ( $pageNo )->setPageSize ( $pageSize )->setOrder ( $order, $direction );
		$fromPart = $collection->getSelect ()->getPart ( Zend_Db_Select::FROM );
		if (isset ( $fromPart ['cat_index'] )) {
			$fromPart ['cat_index'] ['joinCondition'] = preg_replace ( '/category_id\s*=\s*\'\d+\'/', 'category_id > \'0\'', $fromPart ['cat_index'] ['joinCondition'] );
			$collection->getSelect ()->setPart ( Zend_Db_Select::FROM, $fromPart );
		}
		
		if ($specials) {
			$collection->getSelect ()->where ( '`price` > `final_price`' );
		}
		$size = $collection->getSize ();
		$collection->getSelect ()->group ( 'e.entity_id' );
		$collection->load ();
		$productList = $collection->getItems ();
		
		$items = array ();
		foreach ( $productList as $key => $product ) {
			if ($product->getId ()) {
				$items [$key] = $this->_getItemBaseInfo ( $product );
			}
		}
		$products = array ();
		$products ['items'] = $items;
		$products ['total_results'] = $size;
		return $products;
	}
	private function getProductsByQuery($query, $pageNo, $pageSize, $order, $direction) {
		$products = array ();
		if ($query) {
			$helper = Mage::helper ( 'catalogsearch' );
			$this->getRequest ()->setParam ( $helper->getQueryParamName (), $query );
			$query = $helper->getQuery ();
			$query->setStoreId ( Mage::app ()->getStore ()->getId () );
			if ($query->getQueryText ()) {
				if ($helper->isMinQueryLength ()) {
					$query->setId ( 0 )->setIsActive ( 1 )->setIsProcessed ( 1 );
				} else {
					if ($query->getId ()) {
						$query->setPopularity ( $query->getPopularity () + 1 );
					} else {
						$query->setPopularity ( 1 );
					}
					if (false && $query->getRedirect ()) {
						$query->save ();
						return array ();
					} else {
						$query->prepare ();
					}
				}
				$helper->checkNotes ();
				if (! Mage::helper ( 'catalogsearch' )->isMinQueryLength ()) {
					$query->save ();
				}
			}
			
			$layer = Mage::getSingleton ( 'catalogsearch/layer' );
			$collection = $layer->getProductCollection ()->setCurPage ( $pageNo )->setPageSize ( $pageSize )->setOrder ( $order, $direction );
			
			$collection->load ();
			$size = $collection->getSize ();
			$productList = $collection->getItems ();
			$items = array ();
			foreach ( $productList as $key => $product ) {
				if ($product->getId ()) {
					$items [$key] = $this->_getItemBaseInfo ( $product );
				}
			}
			
			$products ['items'] = $items;
			$products ['total_results'] = $size;
		}
		
		return $products;
	}
	private function getProductsByCategory($cid = false, $pageNo = 1, $pageSize = 20, $order = 'entity_id', $direction = 'asc') {
		$layer = Mage::getSingleton ( 'catalog/layer' )->setCurrentCategory ( $cid );
		
		$filter = $this->getRequest ()->getParam ( 'filter', array () );
		if ($filter && is_array ( $filter )) {
			foreach ( $filter as $key => $value ) {
				$this->getRequest ()->setParam ( $key, $value );
			}
			Mage::getBlockSingleton ( 'catalog/layer_view' );
		}
		
		var_dump($filter);
		$collection = $layer->getProductCollection ()->setCurPage ( $pageNo )->setPageSize ( $pageSize )->setOrder ( $order, $direction );
		
		$collection->load ();
		$size = $collection->getSize ();
		$productList = $collection->getItems ();
		
		$items = array ();
		foreach ( $productList as $key => $product ) {
			if ($product->getId ()) {
				$items [$key] = $this->_getItemBaseInfo ( $product );
			}
		}
		$products = array ();
		$products ['items'] = $items;
		$products ['total_results'] = $size;
		return $products;
	}
	public function _getSortingList(){
		$options=Mage::getModel('catalog/config')->getAttributeUsedForSortByArray();
		return $options;
	}
	public function setCollection($collection)
	{
		$this->_collection = $collection;	
		$this->_collection->setCurPage($this->getCurrentPage());	
		// we need to set pagination only if passed value integer and more that 0
		$limit = (int)$this->getLimit();
		if ($limit) {
			$this->_collection->setPageSize($limit);
		}
		if($this->getCurrentOrder() == 'review'){
			$this->_collection->sortByReview($this->getCurrentDirection());
		}
		else if ($this->getCurrentOrder()) {
			$this->_collection->setOrder($this->getCurrentOrder(), $this->getCurrentDirection());
		}
		return $this;
	}
	
}

?>
