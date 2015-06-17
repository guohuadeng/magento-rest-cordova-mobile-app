<?php
class SkyMazon_RestConnect_ItemController extends Mage_Core_Controller_Front_Action {
	/**
	 * Current product object
	 *
	 * @var Mage_Catalog_Model_Product
	 */
	protected $product;
	protected $_keepFrame = true;
	protected $_keepAspectRatio = true; // false stretch the image
	protected $thumbnail_with = 320;
	protected $thumbnail_height = null;
	protected $main_with = 640;
	protected $main_height = null;
	
	/**
	 * the item converted by the current product
	 *
	 */
	private $item = array ();
	private $detail = false;
	const OPTION_TYPE_SELECT = 'select';
	const OPTION_TYPE_CHECKBOX = 'multiselect';
	const OPTION_TYPE_MULTIPLE_SELECT = 'multiselect';
	const OPTION_TYPE_TEXT = 'text';
	const OPTION_TYPE_DATE = 'date';
	const OPTION_TYPE_TIME = 'time';
	const OPTION_TYPE_DATE_TIME = 'datetime';
	// public function getFrontConfig($name) {
	// return Mage::getStoreConfig('Kancart/general/' . $name, Mage::app()->getStore());
	// }
	public function __construct() {
		parent::__construct ();
		// $this->_keepFrame = $this->getFrontConfig ( 'image_frame' ) < 1;
		// $thumbnailSize = $this->getFrontConfig ( 'thumbnail_image' );
		// $mainSize = $this->getFrontConfig ( 'main_image' );
		// if (intval ( $thumbnailSize ) > 80) {
		// $this->thumbnail_with = intval ( $thumbnailSize );
		// if (($index = stripos ( $thumbnailSize, 'x' ))) {
		// $height = intval ( trim ( substr ( $thumbnailSize, $index + 1 ) ) );
		// $this->thumbnail_height = $height > 80 ? $height : null;
		// }
		// }
		// if (intval ( $mainSize ) > 160) {
		// $this->main_with = intval ( $mainSize );
		// if (($index = stripos ( $mainSize, 'x' ))) {
		// $height = intval ( trim ( substr ( $mainSize, $index + 1 ) ) );
		// $this->main_height = $height > 160 ? $height : null;
		// }
		// }
		
		// $this->_keepAspectRatio = $this->main_height < 1;
	}
	public function getItemAction() {
		return json_encode ( $this->_getitem () );
	}
	/**
	 * the API interface function
	 *
	 * @param type $apidata        	
	 * @return type
	 */
	public function _getitem() {
		$apidata = $this->getRequest ()->getParams ();
		$item_id = $apidata ['item_id'];
		if ($this->loadProduct ( $item_id )) {
			$this->detail = true;
			$this->getItemBaseInfo ();
			$this->getItemAttributes ();
			$this->getItemPrices ();
			$this->getItemImages ();
			$this->getProductDescription ();
			$this->getRecommendedItems ();
			// $this->getRelatedItems();
		}
		return array (
				true,
				'0x0000',
				array (
						'item' => $this->item 
				) 
		);
	}
	public function getItemBaseInfo() {
		$helper = Mage::helper ( 'catalog/image' );
		$helper->init ( $this->product, $this->getProductImageType () )->keepAspectRatio ( $this->_keepAspectRatio )->keepFrame ( $this->_keepFrame );
		$this->item ['item_id'] = $this->product->getId ();
		$this->item ['item_title'] = $this->product->getName ();
		$this->item ['item_url'] = $this->product->getProductUrl ();
		$this->item ['cid'] = $this->product->getCategoryIds ();
		$this->item ['qty'] = $this->product->getStockItem ()->getQty ();
		$this->item ['thumbnail_pic_url'] = ( string ) $helper->resize ( $this->thumbnail_with, $this->thumbnail_height );
		$this->item ['main_pic_url'] = ( string ) $helper->resize ( $this->main_with, $this->main_height );
		$this->item ['is_virtual'] = $this->product->isVirtual ();
		$this->item ['item_status'] = $this->product->isSaleable () ? 'instock' : 'outofstock';
		if (! $this->product->getRatingSummary ()) {
			Mage::getModel ( 'review/review' )->getEntitySummary ( $this->product, Mage::app ()->getStore ()->getId () );
		}
		$this->item ['allow_add_to_cart'] = ! $this->HasOptions ();
		$this->item ['rating_score'] = round ( ( int ) $this->product->getRatingSummary ()->getRatingSummary () / 20 );
		$this->item ['rating_count'] = $this->product->getRatingSummary ()->getReviewsCount ();
		$this->item ['sales_type'] = ($this->product->isInStock ()) ? 'stock' : 'distribute';
		$this->item ['qty_min_unit'] = 1;
		$stockItem = $this->product->getStockItem ();
		if ($stockItem) {
			if ($stockItem->getMinSaleQty () && $stockItem->getMinSaleQty () > 0) {
				$this->item ['qty_min_unit'] = $stockItem->getMinSaleQty ();
			}
		}
		$this->item ['item_type'] = $this->product->getTypeId ();
		return $this->item;
	}
	public function getItemPrices() {
		$prices = array ();
		$productType = $this->product->getTypeId ();
		switch ($productType) {
			case Mage_Catalog_Model_Product_Type::TYPE_BUNDLE :
				{
					$prices = $this->collectBundleProductPrices ( $this->product );
				}
				break;
			default :
				{
					$prices = $this->collectProductPrices ( $this->product );
				}
				break;
		}
		$this->item ['prices'] = $prices;
		return $prices;
	}
	public function HasOptions() {
		if (! $this->product->isSaleable ()) {
			return false;
		} else if ($this->product->getHasOptions ()) {
			return true;
		} else {
			return $this->product->getTypeInstance ( true )->hasOptions ( $this->product );
		}
	}
	public function getItemAttributes() {
		$productType = $this->product->getTypeId ();
		switch ($productType) {
			case Mage_Catalog_Model_Product_Type::TYPE_SIMPLE :
				{
					$this->item ['attributes'] = $this->getProductCustomOptionsOption ( $this->product );
				}
				break;
			case Mage_Catalog_Model_Product_Type::TYPE_BUNDLE :
				{
					if ($this->product->getTypeInstance ( true )->hasOptions ( $this->product )) {
						$this->item ['attributes'] = $this->getProductBundleOptions ( $this->product );
					}
				}
				break;
			case Mage_Catalog_Model_Product_Type::TYPE_CONFIGURABLE :
				{
					if ($this->product->isConfigurable ()) {
						$this->item ['attributes'] = $this->getProductOptions ( $this->product );
					}
				}
				break;
			case Mage_Catalog_Model_Product_Type::TYPE_GROUPED :
				{
					$this->item ['attributes'] = $this->getProductGroupedOptions ( $this->product );
				}
				break;
			case Mage_Downloadable_Model_Product_Type::TYPE_DOWNLOADABLE :
				{ // downloadable/catalog_product_links
					$this->item ['attributes'] = $this->getProductDownloadOptions ( $this->product );
				}
				break;
			case Mage_Catalog_Model_Product_Type::TYPE_VIRTUAL :
				{
					$this->item ['attributes'] = array ();
				}
				break;
			default :
				{
					$this->item ['attributes'] = array ();
				}
				break;
		}
		return $this->item ['attributes'];
	}
	public function setProduct($product) {
		$this->product = $product;
	}
	public function loadProduct($itemId) {
		if ($this->product && $this->product->getId ()) {
			return $this->product;
		}
		$this->product = Mage::getModel ( 'catalog/product' )->setStoreId ( Mage::app ()->getStore ()->getId () )->load ( $itemId );
		if ($this->product && $this->product->getId ()) {
			return true;
		}
		return false;
	}
	public function getItem() {
		return $this->item;
	}
	private function getProductImageType() {
		$imageType = 'image';
		$itemData = $this->product->getData ();
		if (isset ( $itemData ['image'] )) {
			$imageType = 'image';
		} else if (isset ( $itemData ['small_image'] )) {
			$imageType = 'small_image';
		} else if (isset ( $itemData ['thumbnail'] )) {
			$imageType = 'thumbnail';
		}
		return $imageType;
	}
	
	/**
	 * add prefix to options to distinguish between options,super attribute,bunlde and super group
	 *
	 * @param type $options        	
	 */
	private function addPrefixTo(&$options, $type) {
		if ($options) {
			foreach ( $options as &$option ) {
				$prefix = "{$type}_" . $option ['attribute_id'];
				$option ['attribute_id'] = $prefix;
				if ($option ['options']) {
					foreach ( $option ['options'] as &$value ) {
						$value ['attribute_id'] = $prefix;
					}
				}
			}
		}
	}
	public function getProductDescription() {
		$_helper = Mage::helper ( 'catalog/output' );
		$this->item ['short_description'] = $_helper->productAttribute ( $this->product, nl2br ( $this->product->getShortDescription () ), 'short_description' );
		$this->item ['short_description'] = preg_replace ( '/(<img[^<>]+?src\s*=\s*\")([^:\"]+\")/i', '$1' . Mage::getBaseUrl () . '$2', $this->item ['short_description'] );
		$this->item ['detail_description'] = $_helper->productAttribute ( $this->product, $this->product->getDescription (), 'description' );
		if (preg_match ( '/{{(.+)}}/i', $this->item ['detail_description'] )) {
			$this->item ['detail_description'] = preg_replace ( '/(\<img[^<>]+src\s*=\s*"){{(\w+)\s*url="(.+)}}/i', '$1' . Mage::getBaseUrl () . '/$2/$3', $this->item ['detail_description'] );
		}
		$this->item ['detail_description'] = preg_replace ( '/(<img[^<>]+?src\s*=\s*\")([^:\"]+\")/i', '$1' . Mage::getBaseUrl () . '$2', $this->item ['detail_description'] );
		$this->item ['specifications'] = $this->getProductFeature ();
	}
	public function getProductFeature() {
		$features = array ();
		if (Mage_Downloadable_Model_Product_Type::TYPE_DOWNLOADABLE == $this->product->getTypeId ()) {
			$block = Mage::getBlockSingleton ( 'downloadable/catalog_product_samples' );
			$block->setProduct ( $this->product );
			if ($block->hasSamples ()) {
				foreach ( $block->getSamples () as $sample ) {
					$features [] = array (
							'name' => $block->getSamplesTitle (),
							'value' => '<a href="' . $block->getSampleUrl ( $sample ) . '" ' . ($block->getIsOpenInNewWindow () ? 'onclick="this.target=\'_blank\'">' : '>') . $block->escapeHtml ( $sample->getTitle () ) . '</a>' 
					);
				}
			}
		} else {
			Mage::register ( 'product', $this->product );
			$block = Mage::getBlockSingleton ( 'catalog/product_view_Attributes' );
			$helper = $block->helper ( 'catalog/output' );
			$data = $block->getAdditionalData ();
			foreach ( $data as $feature ) {
				$features [] = array (
						'name' => $block->htmlEscape ( $block->__ ( $feature ['label'] ) ),
						'value' => $helper->productAttribute ( $this->product, $feature ['value'], $feature ['code'] ) 
				);
			}
		}
		
		return $features;
	}
	private function getItemImageUrl($imageFile = null) {
		$imageType = $this->getProductImageType ();
		$helper = Mage::helper ( 'catalog/image' );
		return ( string ) $helper->init ( $this->product, $imageType, $imageFile )->keepAspectRatio ( $this->_keepAspectRatio )->keepFrame ( $this->_keepFrame )->resize ( $this->main_with, $this->main_height );
	}
	public function getItemImages() {
		$this->item ['item_imgs'] = array ();
		$name = basename ( $this->product->getImageUrl () );
		if (($images = $this->product->getMediaGalleryImages ())) {
			if (count ( $images ) > 0) {
				$position = 0;
				foreach ( $images as $image ) {
					$itemImg = array ();
					$itemImg ['img_id'] = $image->getId ();
					$itemImg ['img_url'] = $this->getItemImageUrl ( $image->getFile () );
					$itemImg ['position'] = ++ $position;
					if ($position > 1 && $name == basename ( $image->getFile () )) {
						$first = $itemImg;
						$first ['position'] = 0;
					} else {
						$this->item ['item_imgs'] [] = $itemImg;
					}
				}
				if (isset ( $first )) {
					$this->item ['item_imgs'] = array_merge ( array (
							$first 
					), $this->item ['item_imgs'] );
				}
				
				return $this->item ['item_imgs'];
			}
		}
		$itemImg = array ();
		$itemImg ['img_id'] = 0;
		$itemImg ['img_url'] = $this->getItemImageUrl ();
		$itemImg ['position'] = 0;
		$this->item ['item_imgs'] [] = $itemImg;
		return $this->item ['item_imgs'];
	}
	public function getRelatedItems() {
		$items = array ();
		$collection = $this->product->getRelatedProductCollection ();
		$layer = Mage::getSingleton ( 'catalog/layer' );
		$layer->prepareProductCollection ( $collection );
		$products = $collection->getItems ();
		if ($products) {
			$itemObject = Kancart::getModel ( 'Item' );
			foreach ( $products as $product ) {
				$itemObject->setProduct ( $product );
				$itemObject->getItemBaseInfo ();
				$itemObject->getItemPrices ();
				$items [] = $itemObject->getItem ();
				$itemObject->clear ();
			}
		}
		$this->item ['related_items'] = $items;
		return $items;
	}
	public function getRecommendedItems() {
		$items = array ();
		$collection = $this->product->getUpSellProductCollection ();
		$layer = Mage::getSingleton ( 'catalog/layer' );
		$layer->prepareProductCollection ( $collection );
		$products = $collection->getItems ();
		if ($products) {
			$itemObject = Kancart::getModel ( 'Item' );
			foreach ( $products as $product ) {
				$itemObject->setProduct ( $product );
				$itemObject->getItemBaseInfo ();
				$itemObject->getItemPrices ();
				$items [] = $itemObject->getItem ();
				$itemObject->clear ();
			}
		}
		$this->item ['recommended_items'] = $items;
		return $items;
	}
	private function getItemTierPrice($_product) { // getTierPrice
		$result = array ();
		if ($this->detail) {
			foreach ( $_product->getTierPrice () as $discount ) {
				$result [] = array (
						'min_qty' => ( int ) $discount ['price_qty'],
						'price' => $this->getCurrencyPrice ( $discount ['price'] ) 
				);
			}
		}
		return $result;
	}
	public function clear() {
		$this->item = array ();
		$this->product = null;
	}
	private function getProductGroupedOptions(Mage_Catalog_Model_Product $product) {
		if (! $product->getId ()) {
			return array ();
		}
		if (! $product->isSaleable ()) {
			return array ();
		}
		/**
		 * Grouped (associated) products
		 */
		$_associatedProducts = $product->getTypeInstance ( true )->getAssociatedProducts ( $product );
		if (! sizeof ( $_associatedProducts )) {
			return array ();
		}
		$attributes = array ();
		foreach ( $_associatedProducts as $_item ) {
			if (! $_item->isSaleable ()) {
				continue;
			}
			$attribute = array ();
			
			$attribute ['attribute_id'] = $_item->getId ();
			$attribute ['input'] = 'product';
			$attribute ['title'] = strip_tags ( $_item->getName () );
			$attribute ['qty'] = $_item->getQty () * 1;
			$attribute ['is_editable'] = 1;
			/**
			 * Process product price
			 */
			if ($_item->getPrice () != $_item->getFinalPrice ()) {
				$productPrice = $_item->getFinalPrice ();
			} else {
				$productPrice = $_item->getPrice ();
			}
			if ($productPrice > 0.00) {
				// add
				$attribute ['price'] = $this->getCurrencyPrice ( $productPrice );
			}
			$attribute ['options'] = array ();
			$attributes [] = $attribute;
		}
		return $attributes;
	}
	private function getProductBundleOptions(Mage_Catalog_Model_Product $product) {
		if ($product->getTypeInstance ( true )->hasOptions ( $product )) {
			$product->getTypeInstance ( true )->setStoreFilter ( $product->getStoreId (), $product );
			$optionCollection = $product->getTypeInstance ( true )->getOptionsCollection ( $product );
			$selectionCollection = $product->getTypeInstance ( true )->getSelectionsCollection ( $product->getTypeInstance ( true )->getOptionsIds ( $product ), $product );
			$bundleOptions = $optionCollection->appendSelections ( $selectionCollection, false, false );
			if (! sizeof ( $bundleOptions )) {
				return array ();
			}
			$attributes = array ();
			foreach ( $bundleOptions as $_option ) {
				$selections = $_option->getSelections ();
				if (empty ( $selections )) {
					continue;
				}
				$type = self::OPTION_TYPE_SELECT;
				if ($_option->isMultiSelection ()) {
					$type = self::OPTION_TYPE_MULTIPLE_SELECT;
				}
				$code = $_option->getId ();
				if ($type == self::OPTION_TYPE_MULTIPLE_SELECT) {
					$code .= '';
				}
				$attribute = array ();
				$attribute ['attribute_id'] = $code;
				$attribute ['parent_id'] = $_option->getParentId ();
				$attribute ['position'] = $_option->getPosition ();
				$attribute ['required'] = $_option->getRequired () || $_option->getIsRequired () || $_option->getIsRequire ();
				$attribute ['input'] = $this->_getOptionTypeForKanCartByRealType ( $_option->getType () );
				$attribute ['title'] = $_option->getTitle ();
				$attribute ['options'] = array ();
				if (! $attribute ['required'] && $attribute ['input'] == self::OPTION_TYPE_SELECT) {
					$none = array (
							'attribute_id' => 'none',
							'option_id' => '',
							'title' => 'None' 
					);
					$attribute ['options'] [] = $none;
				}
				if (empty ( $selections )) {
					$attributes [] = $attribute;
					continue;
				}
				foreach ( $_option->getSelections () as $_selection ) {
					if (! $_selection->isSaleable ()) {
						continue;
					}
					$finalValue = array ();
					$finalValue ['attribute_id'] = $_option->getOptionId ();
					$finalValue ['option_id'] = $_selection->getSelectionId ();
					$finalValue ['title'] = $_selection->getName ();
					$finalValue ['qty'] = ! ($_selection->getSelectionQty () * 1) ? '1' : $_selection->getSelectionQty () * 1;
					$finalValue ['is_default'] = $_selection->getIsDefault ();
					if (! $_option->isMultiSelection ()) {
						if ($_selection->getSelectionCanChangeQty ()) {
							$finalValue ['is_qty_editable'] = 1;
						}
					}
					$price = $product->getPriceModel ()->getSelectionPreFinalPrice ( $product, $_selection );
					if (( float ) $price != 0.00) {
						$finalValue ['price'] = $this->getCurrencyPrice ( $price );
					} else {
						$finalValue ['price'] = null;
					}
					$attribute ['options'] [] = $finalValue;
				}
				$attributes [] = $attribute;
			}
			return $attributes;
		}
		return false;
	}
	
	/**
	 * 仅仅将$attributes中的数据提取出来，其中价格已经是根据当前汇率转换后的价格
	 *
	 * @param type $attributes        	
	 * @return type
	 */
	private function getProductConfigurableAttributes($configurableProductAttributes) {
		$attributes = array ();
		foreach ( $configurableProductAttributes as $attrId => $attribute ) {
			$eachAttribute = array ();
			$eachAttribute ['attribute_id'] = $attrId;
			$eachAttribute ['required'] = $attribute ['is_required'] == '1' ? true : false;
			$eachAttribute ['input'] = 'select';
			$eachAttribute ['title'] = $attribute ['label'];
			$eachAttribute ['options'] = array ();
			if (isset ( $attribute ['options'] )) {
				foreach ( $attribute ['options'] as $option ) {
					$value = array ();
					$value ['attribute_id'] = $attrId;
					$value ['option_id'] = $option ['id'];
					$value ['title'] = $option ['label'];
					$value ['price'] = $option ['price'];
					$eachAttribute ['options'] [] = $value;
				}
			}
			$attributes [] = $eachAttribute;
		}
		return $attributes;
	}
	private function getProductOptions(Mage_Catalog_Model_Product $product) {
		$orgiOptions = $this->getProductCustomOptionsOption ( $product );
		$options = array ();
		if (! $product->isSaleable ()) {
			return $orgiOptions;
		}
		$_attributes = $product->getTypeInstance ( true )->getConfigurableAttributes ( $product );
		if (! sizeof ( $_attributes )) {
			return $orgiOptions;
		}
		$_allowProducts = array ();
		$_allProducts = $product->getTypeInstance ( true )->getUsedProducts ( null, $product );
		foreach ( $_allProducts as $_product ) {
			if ($_product->isSaleable ()) {
				$_allowProducts [] = $_product;
			}
		}
		foreach ( $_allowProducts as $_item ) {
			$_productId = $_item->getId ();
			foreach ( $_attributes as $attribute ) {
				$productAttribute = $attribute->getProductAttribute ();
				$attributeValue = $_item->getData ( $productAttribute->getAttributeCode () );
				$options [$productAttribute->getId ()] [$_productId] = $attributeValue;
			}
		}
		$this->item ['attribute_relation'] = $this->getAttributeRelation ( $options );
		foreach ( $_attributes as $attribute ) {
			$productAttribute = $attribute->getProductAttribute ();
			$attributeId = $productAttribute->getId ();
			$info = array (
					'id' => $productAttribute->getId (),
					'label' => $attribute->getLabel (),
					'is_required' => $productAttribute->getRequired () || $productAttribute->getIsRequired () || $productAttribute->getIsRequire (),
					'options' => array () 
			);
			$prices = $attribute->getPrices ();
			if (is_array ( $prices )) {
				foreach ( $prices as $value ) {
					if (! in_array ( $value ['value_index'], $options [$attributeId] )) {
						continue;
					}
					$info ['options'] [] = array (
							'id' => $value ['value_index'],
							'label' => $value ['label'],
							'price' => $this->_preparePrice ( $product, $value ['pricing_value'], $value ['is_percent'] ) 
					);
				}
			}
			if (sizeof ( $info ['options'] ) > 0) {
				$attributes [$attributeId] = $info;
			}
		}
		$configurabeAttributes = $this->getProductConfigurableAttributes ( $attributes );
		$this->addPrefixTo ( $orgiOptions, 'option' );
		$this->addPrefixTo ( $configurabeAttributes, 'super_attribute' );
		foreach ( $orgiOptions as $opt ) {
			$configurabeAttributes [] = $opt;
		}
		return $configurabeAttributes;
	}
	private function getProductCustomOptionsOption(Mage_Catalog_Model_Product $product) {
		$options = array ();
		if (! $product->getId ()) {
			return $options;
		}
		if (! $product->isSaleable () || ! sizeof ( $product->getOptions () )) {
			return $options;
		}
		foreach ( $product->getOptions () as $option ) {
			$optionObj = array ();
			$type = $this->_getOptionTypeForKanCartByRealType ( $option->getType () );
			$optionObj ['attribute_id'] = $option->getId ();
			$optionObj ['required'] = $option->getRequired () || $option->getIsRequire () || $option->getIsRequired ();
			$optionObj ['input'] = $type;
			$optionObj ['title'] = $option->getTitle ();
			$price = $option->getPrice ();
			if ($price) {
				$optionObj ['price'] = $this->getCurrencyPrice ( $price );
			} else {
				$optionObj ['price'] = null;
			}
			$optionObj ['options'] = array ();
			if (! $optionObj ['required'] && $optionObj ['input'] == self::OPTION_TYPE_SELECT) {
				$none = array (
						'attribute_id' => 'none',
						'option_id' => '',
						'title' => 'None' 
				);
				$optionObj ['options'] [] = $none;
			}
			foreach ( $option->getValues () as $value ) {
				$optionValueObj = array ();
				$optionValueObj ['attribute_id'] = $option->getId ();
				$optionValueObj ['option_id'] = $value->getId ();
				$optionValueObj ['title'] = $value->getTitle ();
				$price = $value->getPrice ();
				if ($price) {
					$optionValueObj ['price'] = $this->getCurrencyPrice ( $price );
				} else {
					$optionValueObj ['price'] = null;
				}
				$optionObj ['options'] [] = $optionValueObj;
			}
			$options [] = $optionObj;
		}
		return $options;
	}
	private function _getOptionTypeForKanCartByRealType($realType) {
		static $map = null;
		
		if (is_null ( $map )) {
			$maps = array (
					Mage_Catalog_Model_Product_Option::OPTION_TYPE_DROP_DOWN => self::OPTION_TYPE_SELECT,
					Mage_Catalog_Model_Product_Option::OPTION_TYPE_RADIO => self::OPTION_TYPE_SELECT,
					Mage_Catalog_Model_Product_Option::OPTION_GROUP_SELECT => self::OPTION_TYPE_SELECT,
					Mage_Catalog_Model_Product_Option::OPTION_TYPE_MULTIPLE => self::OPTION_TYPE_MULTIPLE_SELECT,
					Mage_Catalog_Model_Product_Option::OPTION_TYPE_CHECKBOX => self::OPTION_TYPE_MULTIPLE_SELECT,
					Mage_Catalog_Model_Product_Option::OPTION_TYPE_DATE => self::OPTION_TYPE_DATE,
					Mage_Catalog_Model_Product_Option::OPTION_TYPE_TIME => self::OPTION_TYPE_TIME,
					Mage_Catalog_Model_Product_Option::OPTION_TYPE_DATE_TIME => self::OPTION_TYPE_DATE_TIME,
					Mage_Catalog_Model_Product_Option::OPTION_TYPE_FIELD => self::OPTION_TYPE_TEXT,
					Mage_Catalog_Model_Product_Option::OPTION_TYPE_AREA => self::OPTION_TYPE_TEXT,
					'multi' => self::OPTION_TYPE_MULTIPLE_SELECT 
			);
		}
		
		return isset ( $maps [$realType] ) ? $maps [$realType] : self::OPTION_TYPE_TEXT;
	}
	
	/**
	 * dowload options
	 *
	 * @param type $attributes        	
	 * @return type
	 */
	private function getProductDownloadOptions($product) {
		$block = Mage::getBlockSingleton ( 'downloadable/catalog_product_links' );
		$block->setProduct ( $product );
		$links = $block->getLinks ();
		
		$attributes = array ();
		if ($block->hasLinks ()) {
			$eachAttribute = array ();
			$attrId = strtolower ( $block->getLinksTitle () );
			$eachAttribute ['attribute_id'] = $attrId;
			$eachAttribute ['required'] = ( bool ) $block->getLinkSelectionRequired ();
			$eachAttribute ['input'] = self::OPTION_TYPE_MULTIPLE_SELECT;
			$eachAttribute ['title'] = $block->getLinksTitle ();
			$eachAttribute ['options'] = array ();
			foreach ( $links as $link ) {
				$value = array ();
				preg_match ( '/\d+\.\d+/', $block->getFormattedLinkPrice ( $link ), $prices );
				if ($link->getSampleFile () || $link->getSampleUrl ()) {
					$title = $link->getTitle () . ' (<a href="' . $block->getLinkSamlpeUrl ( $link ) . '" ' . ($block->getIsOpenInNewWindow () ? 'onclick="this.target=\'_blank\'">' : '>') . Mage::helper ( 'downloadable' )->__ ( 'sample' ) . '</a>)';
				} else {
					$title = $link->getTitle ();
				}
				$value ['attribute_id'] = $attrId;
				$value ['option_id'] = $link->getId ();
				$value ['title'] = $title;
				$value ['price'] = floatval ( $prices [0] );
				$eachAttribute ['options'] [] = $value;
			}
			$attributes [] = $eachAttribute;
		}
		return $attributes;
	}
	private function getAttributeRelation($options, $type = 'associate') {
		$attributeRelation = array ();
		
		if ($type == 'associate') {
			if ($options && sizeof ( $options ) > 1) {
				$min = 100;
				$parentAttributeId = 0;
				$parentOption = array ();
				foreach ( $options as $attributeId => $option ) {
					$optionSize = sizeof ( array_flip ( $option ) );
					if ($optionSize < $min) {
						$min = $optionSize;
						$parentAttributeId = $attributeId;
						$parentOption = $option;
					}
				}
				
				foreach ( $options as $attributeId => $option ) {
					if ($parentAttributeId == $attributeId) {
						continue;
					}
					$relations = array ();
					foreach ( $option as $key => $value ) {
						$parentOptionId = $parentOption [$key];
						$relations [$parentOptionId] ['parent_option_id'] = $parentOptionId;
						$relations [$parentOptionId] ['child_option_id'] [] = $value;
					}
					$attributeRelation [] = array (
							'parent_attribute_id' => 'super_attribute_' . $parentAttributeId,
							'child_attribute_id' => 'super_attribute_' . $attributeId,
							'type' => $type,
							'value' => array_values ( $relations ) 
					);
				}
			}
		} elseif ($type == 'display') {
		}
		
		return $attributeRelation;
	}
	private function _preparePrice($product, $price, $isPercent = false) {
		if ($isPercent && ! empty ( $price )) {
			$price = $product->getFinalPrice () * $price / 100;
		}
		$price = Mage::app ()->getStore ()->convertPrice ( $price );
		$price = Mage::app ()->getStore ()->roundPrice ( $price );
		return $price;
	}
	private function collectProductPrices($product) {
		$DisplayMinimalPrice = true;
		$UseLinkForAsLowAs = false;
		$prices = array ();
		$prices ['currency'] = Mage::app ()->getStore ()->getCurrentCurrencyCode ();
		$display_prices = array ();
		$prices ['tier_prices'] = $this->getItemTierPrice ( $product );
		
		$_minimalPriceValue = $product->getMinimalPrice ();
		
		if (! $product->isGrouped ()) {
			$_price = $product->getPrice ();
			$_finalPrice = $product->getFinalPrice ();
			if ($DisplayMinimalPrice && $_minimalPriceValue && $_minimalPriceValue < $_finalPrice) {
				if (! $UseLinkForAsLowAs) {
					if ($_finalPrice > 0) {
						$this->addtoDisplayPrices ( $display_prices, $this->__ ( 'Price:' ), $this->getCurrencyPrice ( $_finalPrice ) );
					}
					if (! $this->detail) { // items list show different
						$this->addtoDisplayPrices ( $display_prices, $this->__ ( 'As low as:' ) . $this->getCurrencyPrice ( $_minimalPriceValue, true, false ), 0, 'free' );
					} else if (! $_finalPrice) {
						$this->addtoDisplayPrices ( $display_prices, $this->__ ( 'As low as:' ), $this->getCurrencyPrice ( $_minimalPriceValue ) );
					}
				}
			} else {
				if ($_finalPrice == $_price) {
					$this->addtoDisplayPrices ( $display_prices, $this->__ ( 'Price:' ), $this->getCurrencyPrice ( $_price ) );
				} else {
					$this->addtoDisplayPrices ( $display_prices, $this->__ ( 'Regular Price:' ), $this->getCurrencyPrice ( $_price ), 'line-through' );
					$this->addtoDisplayPrices ( $display_prices, $this->__ ( 'Special Price:' ), $this->getCurrencyPrice ( $_finalPrice ) );
					$this->item ['discount'] = round ( 100 - ($_finalPrice * 100) / $_price );
				}
			}
		} else {
			if ($DisplayMinimalPrice && $_minimalPriceValue) {
				if (! $this->detail) { // items list show different
					$this->addtoDisplayPrices ( $display_prices, $this->__ ( 'Starting at:' ) . $this->getCurrencyPrice ( $_minimalPriceValue, true, false ), 0, 'free' );
				} else {
					$this->addtoDisplayPrices ( $display_prices, $this->__ ( 'Starting at:' ), $this->getCurrencyPrice ( $_minimalPriceValue ) );
				}
			}
			$_finalPrice = $_minimalPriceValue;
		}
		$prices ['base_price'] = array (
				'price' => $this->getCurrencyPrice ( $_finalPrice ) 
		);
		$prices ['display_prices'] = $display_prices;
		return $prices;
	}
	private function collectBundleProductPrices($product) {
		$prices = array ();
		$prices ['currency'] = Mage::app ()->getStore ()->getCurrentCurrencyCode ();
		$display_prices = array ();
		$prices ['tier_prices'] = $this->getItemTierPrice ( $product );
		
		/* @var $_weeeHelper Mage_Weee_Helper_Data */
		/* @var $_taxHelper Mage_Tax_Helper_Data */
		list ( $_minimalPrice, $_maximalPrice ) = $product->getPriceModel ()->getPrices ( $product );
		$_finalPrice = $product->getFinalPrice ();
		if ($product->getPriceView ()) {
			if ($_finalPrice > 0) {
				$this->addtoDisplayPrices ( $display_prices, $this->__ ( 'Price:' ), $this->getCurrencyPrice ( $_finalPrice ) );
			}
			if (! $this->detail) { // items list show different
				$this->addtoDisplayPrices ( $display_prices, $this->__ ( 'As low as: ' ) . $this->getCurrencyPrice ( $_minimalPrice, true, false ), 0, 'free' );
			} else if (! $_finalPrice) {
				$this->addtoDisplayPrices ( $display_prices, $this->__ ( 'As low as: ' ), $this->getCurrencyPrice ( $_minimalPrice ) );
			}
		} else {
			if ($_minimalPrice != $_maximalPrice) {
				$this->addtoDisplayPrices ( $display_prices, $this->__ ( 'From:' ), $this->getCurrencyPrice ( $_minimalPrice ), 'from' );
				$this->addtoDisplayPrices ( $display_prices, $this->__ ( 'To:' ), $this->getCurrencyPrice ( $_maximalPrice ), 'to' );
			} else {
				$this->addtoDisplayPrices ( $display_prices, $this->__ ( 'Price:' ), $this->getCurrencyPrice ( $_minimalPrice ), 'normal' );
			}
		}
		$prices ['base_price'] = array (
				'price' => $this->getCurrencyPrice ( $_finalPrice ) 
		);
		$prices ['display_prices'] = $display_prices;
		return $prices;
	}
	private function addtoDisplayPrices(&$display_prices, $title, $value, $style = 'normal') {
		$display_prices [] = array (
				'title' => $title,
				'price' => $value,
				'style' => $style ? $style : 'normal' 
		);
		return $display_prices;
	}
}