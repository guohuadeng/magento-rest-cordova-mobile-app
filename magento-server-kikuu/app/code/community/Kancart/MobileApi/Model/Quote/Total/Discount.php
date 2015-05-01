<?php

/**
 * Kancart MobileApi extension
 *
 * @category   kancart
 * @package    Kancart_MobileApi
 * @author     kancart <support@kancart.com>
 */
class Kancart_MobileApi_Model_Quote_Total_Discount extends Mage_Sales_Model_Quote_Address_Total_Abstract {

    public function __construct() {
        $this->setCode('mobileapi');
    }

    public function collect(Mage_Sales_Model_Quote_Address $address) {
        if (!Mage::helper('mobileapi')->isDiscountEnabled()) {
            return $this;
        }

        $address->setMobileDiscount(0);
        $address->setBaseMobileDiscount(0);

        if (Mage::helper('checkout/cart')->getIsVirtualQuote()) {
            $addressType = Mage_Sales_Model_Quote_Address::TYPE_BILLING;
        } else {
            $addressType = Mage_Sales_Model_Quote_Address::TYPE_SHIPPING;
        }
        if ($address->getAddressType() != $addressType) {
            return $this;
        }

        $totalDiscountAmount = $this->getRequest()->getParam('discount_amount');
        if ($totalDiscountAmount && !is_numeric($totalDiscountAmount)) {
            $totalDiscountAmount = $address->getBaseSubtotal() * floatval($totalDiscountAmount) / 100;
        }

        $freeShipping = $this->getRequest()->getParam('coupon_free_ship');
        if ($freeShipping && $freeShipping > 0 && $address->getShippingAmount()) {
            $totalDiscountAmount+=$address->getShippingAmount();
        }

        if ($totalDiscountAmount <= 0) {
            return $this;
        }

        $address->setMobileDiscount($totalDiscountAmount);
        $address->setBaseMobileDiscount($totalDiscountAmount);

        if (!strcasecmp($this->getRequest()->getParam('method'), 'Kancart.Checkout.Start')) {
            $address->setBaseDiscountAmount($address->getBaseDiscountAmount() + $totalDiscountAmount);
            $address->setDiscountAmount($address->getDiscountAmount() + $totalDiscountAmount);
        }

        $address->setGrandTotal($address->getGrandTotal() - $totalDiscountAmount);
        $address->setBaseGrandTotal($address->getBaseGrandTotal() - $totalDiscountAmount);

        return $this;
    }

    /**
     * Retrieve request object
     *
     * @return Mage_Core_Controller_Request_Http
     */
    public function getRequest() {
        return Mage::app()->getRequest();
    }

    public function fetch(Mage_Sales_Model_Quote_Address $address) {
        if (!Mage::helper('mobileapi')->isDiscountEnabled())
            return $this;

        if ($address->getMobileDiscount() > 0) {
            $address->addTotal(array(
                'code' => $this->getCode(),
                'title' => Mage::helper('sales')->__('Discount'),
                'value' => -$address->getMobileDiscount(),
            ));
        }
        return $this;
    }

}