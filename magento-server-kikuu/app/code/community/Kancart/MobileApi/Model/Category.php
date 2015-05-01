<?php

/**
 * KanCart
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@kancart.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade KanCart to newer
 * versions in the future. If you wish to customize KanCart for your
 * needs please refer to http://www.kancart.com for more information.
 *
 * @copyright  Copyright (c) 2011 kancart.com (http://www.kancart.com)
 * @license    http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 */
class Kancart_MobileApi_Model_Category extends Kancart_MobileApi_Model_Abstract {

    public function kancart_category_get() {
        $cid = (int) Mage::app()->getRequest()->getParam('parent_cid', -1);
        $categories = array();

        try {
            $rootCategoryId = Mage::app()->getStore()->getRootCategoryId();
            $cats = $this->getSubCategories($cid == -1 ? $rootCategoryId : $cid);
            foreach ($cats as $category) {
                $parent_cid = $category->getParentId();
                $categories[] = array(
                    'cid' => $category->getId(),
                    'parent_cid' => $parent_cid == $rootCategoryId ? -1 : $parent_cid,
                    'name' => $category->getName(),
                    'is_parent' => $category->hasChildren(),
                    'filter_options' => $this->getFilterOptions($category),
                    'count' => $category->getProductCount(),
                    'position' => $category->getPosition()
                );
            }
        } catch (Exception $e) {
            return array(false, '0x2002', $e->getMessage());
        }
        return array(true, '0x0000', array('item_cats' => $categories));
    }

    /**
     * @param type $parentCategoryId
     * @param type $level
     */
    private function getSubCategories($pId) {
        $category = Mage::getModel('catalog/category')->load($pId);
        if (!$category->getId()) {
            return array();
        }

        $collection = $category->getCollection()
                ->addNameToResult()
                ->addAttributeToSelect('display_mode')
                ->addIsActiveFilter()
                ->addFieldToFilter('include_in_menu', 1)
                ->addPathsFilter($category->getPath() . '/')
                ->addAttributeToSelect('is_anchor')
                ->addOrderField('position');

        $collection->load();
        $categories = $collection->getItems();

        $layer = Mage::getSingleton('catalog/layer');
        foreach ($categories as $key => &$cat) {
            if ($cat->getDisplayMode() == Mage_Catalog_Model_Category::DM_PAGE) {
                if (!$cat->hasChildren()) {
                    $collection->removeItemByKey($key);
                    continue;
                }
            }
            $productCollection = $cat->getProductCollection();
            $layer->prepareProductCollection($productCollection);
            $cat->setProductCount($productCollection->getSize());
        }

        return $categories;
    }

    private function getFilterOptions($category) {
        Mage::getSingleton('catalog/layer')->setCurrentCategory($category);
        $block = Mage::getBlockSingleton('catalog/layer_view');
 
        $filters = array();
        if ($block->canShowBlock() && $block->canShowOptions()) {
            $_filters = $block->getFilters();
            foreach ($_filters as $_filter) {
                $options = array();
                if ($_filter->getItemsCount()) {
                    foreach ($_filter->getItems() as $_item) {
                        $options[] = array(
                            'option_id' => $_item->getValue(),
                            'title' => strip_tags($_item->getLabel()),
                            'count' => $_item->getCount()
                        );
                    }
                    if ($_filter->getAttributeModel()) {
                        $filters[] = array(
                            'title' => $block->__($_filter->getName()),
                            'filter_id' => $_filter->getAttributeModel()->getAttributeCode(),
                            'options' => $options
                        );
                    }
                }
            }
        }

        return $filters;
    }

}

?>