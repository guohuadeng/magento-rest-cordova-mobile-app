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
class Kancart_MobileApi_Model_Review extends Kancart_MobileApi_Model_Abstract {

    public function kancart_reviews_get() {
        $productId = $this->getRequest()->getParam('item_id');
        $pageNo = $this->getRequest()->getParam('page_no', 1);
        $pageSize = $this->getRequest()->getParam('page_size', 10);
        $block = Mage::getBlockSingleton('review/product_view');
        $block->setProductId($productId);
        $collection = $block->getReviewsCollection()
                ->setCurPage($pageNo)
                ->setPageSize($pageSize);

        $rate = Mage::getModel('rating/rating');
        $tradeRates = array();
        foreach ($collection->getItems() as $review) {
            $summary = $rate->getReviewSummary($review->getId());
            if ($summary->getCount() > 0) {
                $rating = round($summary->getSum() / $summary->getCount() / 20);
            } else {
                $rating = 0;
            }

            $tradeRates[] = array(
                'uname' => $review->getNickname(),
                'item_id' => $productId,
                'rate_score' => $rating,
                'rate_content' => $review->getDetail(),
                'rate_date' => $review->getCreatedAt(),
                'rate_title' => $review->getTitle()
            );
        }

        $result = array();
        $result['total_results'] = $collection->getSize();
        $result['trade_rates'] = $tradeRates;

        return array(true, '0x0000', $result);
    }

    public function kancart_review_add() {
        $data = array();
        $data['ratings'] = array();
        $r = (int) $_REQUEST['rating'];
        $data['ratings']['1'] = (string) $r;
        $data['ratings']['2'] = (string) ($r + 5);
        $data['ratings']['3'] = (string) ($r + 10);
        $customer = Mage::getSingleton('customer/session')->getCustomer();
        $data['nickname'] = trim($customer->firstname . ' ' . $customer->lastname);
        $data['nickname'] = empty($data['nickname']) ? 'Mobile' : $data['nickname'];
        $data['title'] = empty($_REQUEST['title']) ? 'From mobile' : $_REQUEST['title'];
        $data['detail'] = $_REQUEST['content'];
        $rating = $data['ratings'];
        if (($product = $this->_loadProduct($_REQUEST['item_id'])) && !empty($data)) {
            $review = Mage::getModel('review/review')->setData($data);
            $validate = $review->validate();
            if ($validate === true) {
                try {
                    $review->setEntityId($review->getEntityIdByCode(Mage_Review_Model_Review::ENTITY_PRODUCT_CODE))
                            ->setEntityPkValue($product->getId())
                            ->setStatusId(Mage_Review_Model_Review::STATUS_PENDING)
                            ->setCustomerId(Mage::getSingleton('customer/session')->getCustomerId())
                            ->setStoreId(Mage::app()->getStore()->getId())
                            ->setStores(array(Mage::app()->getStore()->getId()))
                            ->save();
                    foreach ($rating as $ratingId => $optionId) {
                        Mage::getModel('rating/rating')
                                ->setRatingId($ratingId)
                                ->setReviewId($review->getId())
                                ->setCustomerId(Mage::getSingleton('customer/session')->getCustomerId())
                                ->addOptionVote($optionId, $product->getId());
                    }
                    $review->aggregate();
                    return array(true, '0x0000', 'Your review has been accepted for moderation.');
                } catch (Exception $e) {
                    return array(false, '0x8000', $e->getMessage());
                }
            } else {
                if (is_array($validate)) {
                    $errors = array();
                    foreach ($validate as $errorMessage) {
                        array_push($errors, $errorMessage);
                    }
                    return array(false, '0x8000', $errors);
                } else {
                    return array(false, '0x8000', 'Unable to post the review.');
                }
            }
        }
    }

    protected function _loadProduct($productId) {
        if (!$productId) {
            return false;
        }
        $product = Mage::getModel('catalog/product')
                ->setStoreId(Mage::app()->getStore()->getId())
                ->load($productId);
        if (!$product->getId() || !$product->isVisibleInCatalog() || !$product->isVisibleInSiteVisibility()) {
            return false;
        }
        return $product;
    }

}