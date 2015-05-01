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
abstract class Kancart_MobileApi_Model_Abstract {

    public function __construct() {
        
    }

    public function __() {
        $args = func_get_args();
        return Mage::app()->getTranslator()->translate($args);
    }

    /**
     * Retrieve current layout object
     *
     * @return Mage_Core_Model_Layout
     */
    public function getLayout() {
        return Mage::getSingleton('core/layout');
    }

    public function getItemRenderer(Mage_Sales_Model_Quote_Item_Abstract $item) {
        static $cache = array();

        $productType = $item->getProductType();
        if (!isset($cache[$productType])) {
            switch ($productType) {
                case Mage_Catalog_Model_Product_Type::TYPE_CONFIGURABLE:
                    $renderer = new Mage_Checkout_Block_Cart_Item_Renderer_Configurable();
                    break;
                case Mage_Catalog_Model_Product_Type::TYPE_BUNDLE:
                    $renderer = new Mage_Bundle_Block_Checkout_Cart_Item_Renderer();
                    break;
                case Mage_Downloadable_Model_Product_Type::TYPE_DOWNLOADABLE:
                    $renderer = new Mage_Downloadable_Block_Checkout_Cart_Item_Renderer();
                    break;
                default:
                    $renderer = new Mage_Checkout_Block_Cart_Item_Renderer();
                    break;
            }
            $cache[$productType] = $renderer;
        }
        $renderer = $cache[$productType];
        $renderer->setItem($item);

        return $renderer;
    }

    public function toAddressData($address) {
        if (!$address) {
            return array();
        }
        if (!$address->getLastname() && strpos($address->getFirstname(), ' ') > 0) {
            $name = explode(' ', $address->getFirstname());
            $address->setFirstname($name[0]);
            $address->setLastname($name[1]);
        }
        if ($address->getCustomerAddressId()) {
            $addressId = $address->getCustomerAddressId();
        } else {
            $addressId = $address->getId();
        }
        $defaultAddressId = Mage::getSingleton('customer/session')->getCustomer()->getDefaultShipping();
        $addressData = array(
            'address_type' => $address->getAddressType(),
            'address_book_id' => $addressId,
            'is_default' => $addressId == $defaultAddressId,
            'firstname' => $address->getFirstname(),
            'lastname' => $address->getLastname(),
            'gender' => $address->getGender(),
            'suffix' => $address->getSuffix(),
            'mobile' => $address->getTelephone(),
            'company' => $address->getCompany(),
            'fax' => $address->getFax(),
            'telephone' => $address->getTelephone(),
            'postcode' => $address->getPostcode(),
            'city' => $address->getCity(),
            'address1' => $address->getStreet(1),
            'address2' => $address->getStreet(2),
            'country_id' => $address->getCountryId(),
            'country_code' => $address->getIso2Code(),
            'country_name' => $address->getCountry(),
            'zone_id' => $address->getRegionId(),
            'zone_name' => $address->getRegion(),
            'state' => $address->getRegion()
        );

        return $addressData;
    }

    protected function getAvailablePayment() {
        if (Mage::getStoreConfig('payment/paypal_standard/active') < 1 && Kancart::helper('Data')->getFrontConfig('paypal_standard') > 0) {
            Mage::app()->getStore()->setConfig('payment/paypal_standard/active', true);
        }
        if (Mage::getStoreConfig('payment/paypal_express/active') < 1 && Kancart::helper('Data')->getFrontConfig('paypal_express') > 0) {
            Mage::app()->getStore()->setConfig('payment/paypal_express/active', true);
        }
        $block = Mage::getBlockSingleton('Checkout/Onepage_Payment_Methods');
        if ($block) {
            return $block->getMethods();
        }

        return array();
    }

    protected function getPriceInfos() {
        $PriceInfos = array();
        $position = 0;
        $currency = Mage::app()->getStore()->getCurrentCurrencyCode();
        $block = Mage::getBlockSingleton('Checkout/Cart_Totals');
        method_exists($block, 'canApplyMsrp') && $block->canApplyMsrp();
        foreach ($block->getTotals() as $item) {
            if (strlen($item->getTitle()) < 1) {
                continue;
            }
            if ($item->getAs()) {
                $type = $item->getAs();
            } else {
                $type = $item->getCode();
            }
            if ($type == 'grand_total') {
                $type = 'total';
            } elseif ($type == 'reward_label') {
                $type = 'info';
            }

            $PriceInfos[] = array(
                'title' => $item->getTitle(),
                'currency' => $currency,
                'type' => $type,
                'price' => $item->getValue(),
                'position' => $position++
            );
        }
        return $PriceInfos;
    }

    /**
     * Retrieve request object
     *
     * @return Mage_Core_Controller_Request_Http
     */
    public function getRequest() {
        return Mage::app()->getRequest();
    }

    /**
     * Retrieve Onepage object
     *
     * @return Mage_Checkout_Model_Type_Onepage
     */
    public function getOnepage() {
        return Mage::getSingleton('checkout/type_onepage');
    }

    public function isLoggedIn() {
        return Mage::getSingleton('customer/session')->isLoggedIn();
    }

    public function getCurrencyPrice($price, $format = false, $includeContainer = false, $includeTax = PRICE_INCLUDE_TAX) {
        if ($includeTax && isset($this->product) && is_object($this->product)) {
            $price = Mage::helper('tax')->getPrice($this->product, $price, true);
        }
        return Mage::helper('core')->currency($price, $format, $includeContainer);
    }

}