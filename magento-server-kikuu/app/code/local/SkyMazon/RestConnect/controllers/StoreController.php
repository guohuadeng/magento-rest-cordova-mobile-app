<?php
class SkyMazon_RestConnect_StoreController extends Mage_Core_Controller_Front_Action {
	public function websiteInfoAction() {
		// Mage::app ()->getWebsites ();
		// Mage::app ()->getStores ();
		$basicinfo = array ();
		foreach ( Mage::app ()->getWebsites () as $sk=> $website ) {
			$basicinfo[$sk]['webside']['name']=$website->getName();
			$basicinfo[$sk]['webside']['id']=$website->getId();
			foreach ( $website->getGroups () as $key=> $group ) {
				$basicinfo [$sk]['webside'][$key]['store']=$group->getName();
				$basicinfo [$sk]['webside'][$key]['store_id']=$group->getGroupId ();
				$basicinfo [$sk]['webside'][$key]['root_category_id']=$group->getRootCategoryId ();
				$stores = $group->getStores ();
				foreach ( $stores as $oo =>$_store ) {
					$basicinfo [$sk]['webside'][$key]['view'][$oo] = array (
							'name' => $_store->getName (),
							'store_id' => $_store->getStoreId (),
							'store_url' => $_store->getUrl (),
							'store_code'=>$_store->getCode(),
							'sort_order' => $_store->getSortOrder(),
							'is_active' =>$_store->getIsActive()
					);
				}
			}
			
		}
		echo json_encode($basicinfo);
		// public function getStoresStructure($isAll = false, $storeIds = array(), $groupIds = array(), $websiteIds = array())
		// echo json_encode ( Mage::getSingleton ( 'adminhtml/system_store' )->getStoresStructure (TRUE) );
		// echo json_encode(Mage::getSingleton('adminhtml/system_store')->getStoreValuesForForm(false, true));
	}
	public function storeInfoAction(){
		$website_id = Mage::app()->getStore()->getWebsiteId();
		$website_name = Mage::app ()->getWebsite($website_id) -> getName();
		$group_id = Mage::app()->getStore()->getGroupId();
		$group_name = Mage::app ()->getGroup($group_id) -> getName();
		
		
		echo json_encode(array('store_id'=>Mage::app()->getStore()->getStoreId(),
				'store_code'=>Mage::app()->getStore()->getCode(),
				'website_id'=>$website_id,
				'website_name'=>$website_name,
				'group_id'=>$group_id,
				'group_name'=>$group_name,
				'name'=>Mage::app()->getStore()->getName(),
				'sort_order' => Mage::app()->getStore()->getSortOrder(),
				'is_active'=>Mage::app()->getStore()->getIsActive(),
				'root_category_id' => Mage::app()->getStore()->getRootCategoryId(),
				//'url'=>Mage::app()->getStore()->getHomeUrl()
				'url'=> Mage::helper('core/url')->getHomeUrl()
	
		));		
	}
	
}
