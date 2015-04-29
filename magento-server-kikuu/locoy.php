<?php

$storeId=0; 
$auto_cate = true; 
@set_time_limit(1000);
@ini_set('memory_limit', '100M');
@extract($_REQUEST,EXTR_OVERWRITE);

if (file_exists('app/Mage.php')) {
	require_once 'app/Mage.php';
} else {
	exit("[ERROR] Please place the files into the root directory!");
}

$mageto = Mage :: app();
$storeId = isset($storeId) ? $storeId : $mageto->getStore()->getId();
$rootId = Mage::app()->getStore($storeId)->getRootCategoryId();
$websiteIds[] = Mage::app()->getStore($storeId)->getWebsiteId();

if (empty($name)) {
	$categories = Mage::getModel('catalog/category')
		->getCollection()
		->setStoreId($storeId)
		->addAttributeToSelect('*')
		->addIsActiveFilter(1);
	echo "<select>";
	foreach ($categories as $cat) {
		$levelstr = "|--";
		for ($i=2; $i < $cat['level']; $i++) {
			$levelstr .= "----";
		}
		echo "<option value=\"".preg_replace(array("~^\d+\/\d+\/~i","~\/~"), array("",","), $cat['path'])."\">{$levelstr}{$cat['name']}</option>\r\n";
	}
	echo "</select>";
	exit();
}

if (!$attributeSetId)	{
	$attributeSetId="Default";
	}
$product = Mage :: getModel('catalog/product');
$product -> setStoreId($storeId);
$productId = $product -> getIdBySku($sku);

if ($productId) {
	exit("[OK]SKU Repeat \r\n[ID]{$productId}");
} else {
	$websiteIds = array();
	$websiteIds[] = Mage::app()->getStore()->getWebsiteId();
	$product->setWebsiteIds($websiteIds);
	$Attribute= locoy_getProductAttributeSets();
	$product->setAttributeSetId($Attribute[$attributeSetId]);
	$productTypes = locoy_getProductTypes();
	$product->setTypeId($productTypes['simple']);
	$sku = empty($sku) ? uniqid("A") : $sku;
	$product->setSku($sku);
	$product->setName($name);
	$product->setDescription($description);
	if(!empty($short_description)){
		$product->setShortDescription($short_description);
	}

	if(!empty($meta_title)){
		$product -> setMetaTitle($meta_title);
	}

	if(!empty($meta_description)){
		$product -> setMetaDescription($meta_description);
	}

	if(!empty($meta_keyword)){
		$product -> setMetaKeyword($meta_keyword);
	}
	Mage::getModel('tax/class')
		->getCollection()
		->setClassTypeFilter(Mage_Tax_Model_Class::TAX_CLASS_TYPE_PRODUCT)
		->toOptionHash();
	$product->setTaxClassId(0);

//	if (!empty($weight)) {
		$weight = preg_replace("~[^0-9\.]+~i", "", $weight);
		$product->setWeight($weight);
//	} else {
//		$product->setWeight(100);
//	}

	$stock = empty($stock) ? 99 : $stock;
	$product->setStockData(array(
		'is_in_stock' => 1,
		'qty' => $stock,
		));

	$price = preg_replace("~[^0-9\.]+~i", "", $price);
	$product->setPrice($price);
	$special_price = preg_replace("~[^0-9\.]+~i", "", $special_price);
	$product->setSpecial_price($special_price);

	if(!empty($special)){
		$special = preg_replace("~[^0-9\.]+~i", "", $special);
		$product->setSpecialPrice($special);
	}



	if ($tierprice) {
		$tierprice_array = array();
		$tierprice_list = array_filter(explode('|||',$tierprice));
		foreach ($tierprice_list as $key=>$value) {
			$xtprice = explode("=",$value);
			$tierprice_array[] = array(
				'website_id' => 0,
				'cust_group' => 32000,
				'price_qty' => $xtprice[0],
				'price' => $xtprice[1]
			);
		}
		$product->setTierPrice($tierprice_array);
	}

	if (!$product->getVisibility()) {
		$product->setVisibility(Mage_Catalog_Model_Product_Visibility::VISIBILITY_BOTH);
	}

	if ($categories && $auto_cate) {
		$category_ids = locoy_addCategories($categories,Mage::app()->getStore($storeId));
		$product->setCategoryIds($category_ids);
	} else {
		$product->setCategoryIds($category_ids);
	}

	if (stripos($imagelist,"|||"))	{	//如果有图片list，则用多图list代替单图
		$images = $imagelist;
		}

	if ($images) {
		$importPath = Mage :: getBaseDir('media') . DS . 'import'. DS ;
		//echo $importPath;
		$imgarr = array();
		$images = str_replace("#||#", "|||", $images);
		$gallery = array_unique(array_filter(@explode('|||',$images)));
		foreach($gallery as $img){
			if (preg_match("~^http:~i", $img)) {
				$imgname = md5($img).'.'.end(explode('.',$img));
				if (httpcopy($img,$importPath.$imgname)) {
					$imgarr[] = $imgname;
				}
			} elseif (is_file($importPath.$img)) {
				$imgarr[] = $img;
			}
		}

		foreach ($imgarr as $key=>$gallery_img) {
			if ($key==0) {
				$product->addImageToMediaGallery($importPath.$gallery_img,array('thumbnail','small_image','image'),true,false);
			} else {
				$product->addImageToMediaGallery($importPath.$gallery_img, null, true, false);
			}
		}
	}

	$product->setStatus(1);
	$product->setIsMassupdate(true);
	$product->setExcludeUrlRewrite(true);
	$options=locoy_customOptions($custom_options);
	if(count($options)) {
		$product->setHasOptions(true);
	}

	try{
		$product->save();
	}catch (Exception $e) {}

	$productId = $product -> getId();

	if ($productId) {
		echo "[OK]Public pass\r\n[ID]{$productId}";
		if(count($options)) {
			foreach($options as $option) {
				try {
					$opt = Mage::getModel('catalog/product_option');
					$opt->setProduct($product);
					$opt->addOption($option);
					$opt->saveOptions();
				}
				catch (Exception $e) {}
			}
		}
	}
}

function locoy_customOptions($customoptions) {
	if (!is_array($customoptions) or empty($customoptions)) {
		return false;
	}

	$_optionsCache = array();
	foreach ($customoptions as $key => $value) {
		if (empty($value)) {
			continue;
		}
		$_values = array_filter(explode("|||", $value));
		@list($title, $type, $is_required,$sort_order) = explode("|", $key);
		$title = ucfirst(str_replace('_',' ',$title));
		$_optionsCache[] = array(
			 'is_delete'=>0,
			 'title'=>$title,
			 'previous_group'=>'',
			 'previous_type'=>'',
			 'type'=>$type,
			 'is_require'=>$is_required,
			 'sort_order'=>$sort_order,
			 'values'=>array()
		);

		foreach($_values as $v) {
			 $parts = explode(':',$v);
			 $title = $parts[0];
			 if(count($parts)>1) {
				$price_type = $parts[1];
			 } else {
				$price_type = 'fixed';
			 }
			 if(count($parts)>2) {
				$price = $parts[2];
			 } else {
				$price =0;
			 }

			 if(count($parts)>3) {
				$sku = $parts[3];
			 } else {
				$sku='';
			 }

			 if(count($parts)>4) {
				$sort_order = $parts[4];
			 } else {
				$sort_order = 0;
			 }

			 switch($type) {
				case 'file':
				 break;
				case 'field':
				case 'area':
				 $_optionsCache[count($_optionsCache) - 1]['max_characters'] = $sort_order;
				case 'date':
				case 'date_time':
				case 'time':
				 $_optionsCache[count($_optionsCache) - 1]['price_type'] = $price_type;
				 $_optionsCache[count($_optionsCache) - 1]['price'] = $price;
				 $_optionsCache[count($_optionsCache) - 1]['sku'] = $sku;
				 break;
				case 'drop_down':
				case 'radio':
				case 'checkbox':
				case 'multiple':
				default:
				 $_optionsCache[count($_optionsCache) - 1]['values'][]=array(
					'is_delete'=>0,
					'title'=>$title,
					'option_type_id'=>-1,
					'price_type'=>$price_type,
					'price'=>$price,
					'sku'=>$sku,
					'sort_order'=>$sort_order,
				 );
				 continue;
			 }
		}
	}
	return $_optionsCache;
}



function locoy_addCategories($categories, $store) {
	$_categoryCache = array();
	$rootId = $store->getRootCategoryId();
	if (!$rootId) {
		$storeId = 1;
		 $rootId = Mage::app()->getStore($storeId)->getRootCategoryId();
	}

	if($categories=="") return array();
	$rootPath = '1/'.$rootId;
	if (empty($_categoryCache[$store->getId()])) {
		$collection = Mage::getModel('catalog/category')->getCollection()
			->setStore($store)
			->addAttributeToSelect('name');
		$collection->getSelect()->where("path like '".$rootPath."/%'");

		foreach ($collection as $cat) {
			$pathArr = explode('/', $cat->getPath());
			$namePath = '';
			for ($i=2, $l=sizeof($pathArr); $i<$l; $i++) {
				$name = $collection->getItemById($pathArr[$i])->getName();
				 $namePath .= (empty($namePath) ? '' : '/').trim($name);
			}
			$cat->setNamePath($namePath);
		}
		$cache = array();
		foreach ($collection as $cat) {
			$cache[strtolower($cat->getNamePath())] = $cat;
			$cat->unsNamePath();
		}
		$_categoryCache[$store->getId()] = $cache;
	}

	$cache =& $_categoryCache[$store->getId()];
	$catIds = array();
	foreach (explode('###', $categories) as $categoryPathStr) {
		$categoryPathStr = preg_replace('#\s*/\s*#', '/', trim($categoryPathStr));
		if (!empty($cache[$categoryPathStr])) {
			$catIds[] = $cache[$categoryPathStr]->getId();
			continue;
		}
		$path = $rootPath;
		$namePath = '';
		foreach (array_filter(explode('|||', $categoryPathStr)) as $catName) {
			$namePath .= (empty($namePath) ? '' : '/').strtolower($catName);
			if (empty($cache[$namePath])) {
				$cat = Mage::getModel('catalog/category')
				->setStoreId($store->getId())
				->setPath($path)
				->setName($catName)
				->setIsActive(1)
				->save();
				$cache[$namePath] = $cat;
			}

			$catId = $cache[$namePath]->getId();
			$path .= '/'.$catId;
			if ($catId) {
				$catIds[] = $catId;
			}
		}
	}
	return join(',', $catIds);
}



function locoy_getProductAttributeSets() {
	$productAttributeSets = array();
	$entityTypeId = Mage::getModel('eav/entity')
		->setType('catalog_product')
		->getTypeId();
	$collection = Mage::getResourceModel('eav/entity_attribute_set_collection')
		->setEntityTypeFilter($entityTypeId);

	foreach ($collection as $set) {
		$productAttributeSets[$set->getAttributeSetName()] = $set->getId();
	 }
	 return $productAttributeSets;
}



function locoy_getProductTypes() {
	$productTypes = array();
	$options = Mage::getModel('catalog/product_type')
		->getOptionArray();

	foreach ($options as $k => $v) {
		$productTypes[$k] = $k;
	}
return $productTypes;
}



function httpcopy($url, $file="", $timeout=60) {
	$file = empty($file) ? pathinfo($url,PATHINFO_BASENAME) : $file;
	$dir = pathinfo($file,PATHINFO_DIRNAME);
	!is_dir($dir) && @mkdir($dir,0755,true);
	$url = trim(str_replace(" ","%20",$url));

	if(function_exists('curl_init')) {
	 	$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
		//增加模拟浏览器
		curl_setopt($ch, CURLOPT_USERAGENT,"Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)"); 	
		
		$temp = curl_exec($ch);
		if(@file_put_contents($file, $temp) && !curl_error($ch)) {
			return $file;
		} else {
			return false;
		}
	} else {
		$opts = array(
			"http"=>array(
			"method"=>"GET",
			"header"=>"",
			"timeout"=>$timeout)
		);

		$context = stream_context_create($opts);
		if(@copy($url, $file, $context)) {
			return $file;
		} else {
			return false;
		}
	}
}
?>