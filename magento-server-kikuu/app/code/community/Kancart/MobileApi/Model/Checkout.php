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
class Kancart_MobileApi_Model_Checkout extends Kancart_MobileApi_Model_Abstract {

    protected $_customer;
    protected $_checkout;
    protected $_quote;

    public function kancart_shoppingcart_addresses_update() {
        $addressData = $this->getRequest()->getParams();
        $address_id = max($addressData['shipping_address_book_id'], $addressData['billing_address_book_id']);
        $address = max($addressData['shipping_address'], $addressData['billing_address']);

        if ($address) { // update or add address
            $address = json_decode(htmlspecialchars_decode($address, ENT_COMPAT), true);
            $_POST = array_merge($_POST, $address);
            $_POST['address_book_id'] = $address_id;
            list($result, $code, $address_id) = Kancart::getModel('User')->kancart_user_address_update();
            if ($result === false) {
                $address['street'] = array($address['address1'], $address['address2']);
                $address['region'] = isset($address['state']) ? $address['state'] : $address['zone_name'];
                $address['region_id'] = $address['zone_id'];
                $address_id = null;
            }
        }

        $address['same_as_billing'] = 1;
        if ($this->getQuote()->isVirtual()) {
            $this->getOnepage()->saveBilling($address, $address_id);
        } else {
            $this->getOnepage()->saveShipping($address, $address_id);
        }

        if (!$this->isLoggedIn()) {
            $this->getOnepage()->saveBilling($address, $address_id);
        }

        return $this->shoppingCartCheckoutDetail();
    }

    public function kancart_shoppingcart_checkout_detail() {
        if ($this->getRequest()->getParam('payment_method_id') == 'paypalwpp') {
            Kancart::getModel('PayPalEC')->kancart_shoppingcart_paypalec_detail();
        } else {
            if (!$this->isLoggedIn() && !$this->getRequest()->getParam('guest_checkout')) {
                return array(false, '0x0002', 'You need login first.');
            }

            $quote = $this->getOnepage()->getQuote();
            if (!$quote->hasItems() || $quote->getHasError()) {
                $checkoutDetailArr = array(
                    'redirect_to_page' => Kancart_MobileApi_Model_Result::SHOPPING_CART,
                    'messages' => $quote->getMessages()
                );
                return array(true, '0x0000', $checkoutDetailArr);
            }

            if (!$quote->validateMinimumAmount()) {
                $error = Mage::getStoreConfig('sales/minimum_order/error_message');
                $checkoutDetailArr = array(
                    'redirect_to_page' => Kancart_MobileApi_Model_Result::SHOPPING_CART,
                    'messages' => array($error)
                );
                return array(true, '0x0000', $checkoutDetailArr);
            }
        }

        Mage::getSingleton('checkout/session')->setCartWasUpdated(false);
        $this->getOnepage()->initCheckout();

        return $this->shoppingCartCheckoutDetail();
    }

    public function shoppingCartCheckoutDetail() {
        $this->getQuote()->setTotalsCollectedFlag(false)->collectTotals()->save();
        $checkoutDetailArr = array();
        $checkoutDetailArr['is_virtual'] = $is_virtual = $this->getQuote()->isVirtual();
        $checkoutDetailArr['need_billing_address'] = $need_billing_address = defined('NEED_BILLING_ADDRESS') ? NEED_BILLING_ADDRESS : false;
        $checkoutDetailArr['shipping_address'] = $this->getShippingAddress($is_virtual);
        $checkoutDetailArr['billing_address'] = $this->getBillingAddress($is_virtual, $need_billing_address);
        $checkoutDetailArr['need_shipping_address'] = !Kancart::getModel('Store')->checkAddressIntegrity($checkoutDetailArr['shipping_address']);
        $checkoutDetailArr['billing_address_valid'] = Kancart::getModel('Store')->checkAddressIntegrity($checkoutDetailArr['billing_address']);
        $checkoutDetailArr['review_orders'] = array($this->getOrderReview());
        $checkoutDetailArr['need_select_shipping_method'] = !$is_virtual && empty($checkoutDetailArr['review_orders'][0]['selected_shipping_method_id']);
        $checkoutDetailArr['price_infos'] = $this->getPriceInfos();
        $checkoutDetailArr['payment_methods'] = $this->getPaymentMethods();

        if (isset($_SESSION['checkout_messages']) && $_SESSION['checkout_messages']) {
            $checkoutDetailArr['messages'] = $_SESSION['checkout_messages'];
            unset($_SESSION['checkout_messages']);
        }
        return array(true, '0x0000', $checkoutDetailArr);
    }

    private function getBillingAddress($is_virtual, $need_billing_address) {
        $billing_address = $this->getQuote()->getBillingAddress();
        if (!$billing_address->getData('street') && (($is_virtual && $need_billing_address) || !$is_virtual)) {
            $billing_address = $this->getCustomer()->getPrimaryBillingAddress();
            if (empty($billing_address)) {
                $billing_address = current($this->getCustomer()->getAddresses());
                if ($billing_address && $billing_address->getId()) {
                    $billing_address->setIsDefaultBilling(true)->save();
                }
            }
            if ($billing_address) {
                $billing_address = Mage::getModel('sales/quote_address')->importCustomerAddress($billing_address);
            } else {
                return array();
            }
        }
        $this->getQuote()->setBillingAddress($billing_address);
        return $this->toAddressData($billing_address);
    }

    private function getShippingAddress($is_virtual) {
        $shipping_address = $this->getQuote()->getShippingAddress();
        if (!$shipping_address->getData('country_id') && !$is_virtual) {
            $shipping_address = $this->getCustomer()->getPrimaryShippingAddress();
            if (empty($shipping_address)) {
                $shipping_address = current($this->getCustomer()->getAddresses());
                if ($shipping_address && $shipping_address->getId()) {
                    $shipping_address->setIsDefaultShipping(true)->save();
                }
            }
            if ($shipping_address) {
                $shipping_address = Mage::getModel('sales/quote_address')->importCustomerAddress($shipping_address);
            } else {
                return array();
            }
        }
        $this->getQuote()->setShippingAddress($shipping_address);
        return $this->toAddressData($shipping_address);
    }

    private function getPaymentMethods() {
        //Get PaymentMethod
        $payment = array();
        $methods = $this->getAvailablePayment();
        foreach ($methods as $method) {
            if ($method->getCode() == 'paypal_standard') {
                $payment[1] = array('pm_id' => 'paypal',
                    'pm_title' => $method->getTitle(),
                    'pm_code' => $method->getCode(),
                    'description' => $method->getDescription(),
                    'img_url' => '');
            } else if ($method->getCode() == 'paypal_express') {
                $payment[0] = array('pm_id' => 'paypalwpp',
                    'pm_title' => $method->getTitle(),
                    'pm_code' => $method->getCode(),
                    'description' => $method->getDescription(),
                    'img_url' => '');
            }
        }
        ksort($payment);

        return $payment;
    }

    public function getOrderReview() {
        $orderReviewArr = array();
        $orderReviewArr['cart_items'] = Kancart::getModel('Cart')->getCartItems();
        $orderReviewArr['order_id'] = $this->getOnepage()->getLastOrderId();
        $orderReviewArr['coupon_code'] = $this->getQuote()->getCouponCode();
        $orderReviewArr['shipping_methods'] = $this->getShippingMethods();
        $orderReviewArr['selected_shipping_method_id'] = $this->getQuote()->getShippingAddress()->getShippingMethod();
        return $orderReviewArr;
    }

    public function kancart_shoppingcart_shippingmethods_update() {
        $params = $this->getRequest()->getParams();
        $ShippingRateCode = $params['shipping_method_id'];
        $shippingMethodResult = $this->getOnepage()->saveShippingMethod($ShippingRateCode);
        Mage::dispatchEvent('checkout_controller_onepage_save_shipping_method', array('request' => $this->getRequest(), 'quote' => $this->getOnepage()->getQuote()));
        $this->getOnepage()->getQuote()->collectTotals()->save();
        if (isset($shippingMethodResult['error'])) {
            $_SESSION['checkout_messages'][] = $shippingMethodResult['message'];
        }

        return $this->shoppingCartCheckoutDetail();
    }

    public function getShippingMethods() {
        try {
            $this->getOnepage()->getQuote()->getShippingAddress()->setCollectShippingRates(true);
            $this->getOnepage()->getQuote()->collectTotals()->save();
            $shippingMethods = array();

            $layout = $this->getLayout();
            $layout->getUpdate()->load('checkout_onepage_shippingmethod');
            $layout->generateXml()->generateBlocks();
            $block = $layout->getBlock('root');

            if (($_shippingRateGroups = $block->getShippingRates())) {
                foreach ($_shippingRateGroups as $code => $_rates) {
                    foreach ($_rates as $_rate) {
                        if (!$_rate->getErrorMessage()) {
                            $_excl = Mage::helper('tax')->getShippingPrice($_rate->getPrice(), Mage::helper('tax')->displayShippingPriceIncludingTax(), $this->getQuote()->getShippingAddress());
                            $shippingMethods[] = array(
                                'sm_id' => $_rate->getCode(),
                                'title' => trim("{$_rate->getCarrierTitle()} - {$_rate->getMethodTitle()}", ' -'),
                                'description' => strip_tags($_rate->getMethodDescription()),
                                'sm_code' => $code,
                                'price' => $this->getQuote()->getStore()->convertPrice($_excl, false, false),
                                'currency' => Mage::getModel('core/store')->load(Mage::app()->getStore()->getId())->getCurrentCurrencyCode()
                            );
                        }
                    }
                }
                if (!$this->getQuote()->getShippingAddress()->getShippingMethod()) {
                    $this->getOnepage()->saveShippingMethod($shippingMethods[0]['sm_id']);
                    Mage::dispatchEvent('checkout_controller_onepage_save_shipping_method', array('request' => $this->getRequest(), 'quote' => $this->getOnepage()->getQuote()));
                }
                $this->getOnepage()->getQuote()->collectTotals()->save();
                $this->getQuote()->setTotalsCollectedFlag(false)->collectTotals()->save();
            } else {
                //$_SESSION['checkout_messages'][] = $block->__('Sorry, no quotes are available for this order at this time.');
            }

            return $shippingMethods;
        } catch (Mage_Core_Exception $e) {
            return $e->getMessage();
        }
    }

    public function kancart_shoppingcart_coupons_update() {
        try {
            $couponCode = $this->getRequest()->getParam('coupon_id');
            $cart = Mage::getSingleton('checkout/cart');
            if (!$cart->getQuote()->getItemsCount()) {
                throw new Exception('Cart is empty.');
            }
            $message = $this->updateCoupon($couponCode);
            if ($message) {
                $_SESSION['checkout_messages'] = array(array(
                        'type' => 'success',
                        'content' => $message)
                );
            }
        } catch (Exception $e) {
            $_SESSION['checkout_messages'] = array(array(
                    'type' => 'fail',
                    'content' => $e->getMessage())
            );
        }

        return $this->shoppingCartCheckoutDetail();
    }

    public function updateCoupon($couponCode) {
        $oldCouponCode = $this->getQuote()->getCouponCode();
        if (!strlen($couponCode) && !strlen($oldCouponCode)) {
            return;
        }
        $message = '';
        try {
            $this->getQuote()->getShippingAddress()->setCollectShippingRates(true);
            $this->getQuote()->setCouponCode(strlen($couponCode) ? $couponCode : '')
                    ->collectTotals()
                    ->save();
            if (strlen($couponCode)) {
                if ($couponCode == $this->getQuote()->getCouponCode()) {
                    $message = $this->__('Coupon code "%s" was applied.', Mage::helper('core')->htmlEscape($couponCode));
                } else {
                    $message = $this->__('Coupon code "%s" is not valid.', Mage::helper('core')->htmlEscape($couponCode));
                }
            } else {
                $message = $this->__('Coupon code was canceled.');
            }
        } catch (Mage_Core_Exception $e) {
            throw new Excpetion($e->getMessage());
        } catch (Exception $e) {
            throw new Excpeiton($this->__('Cannot apply the coupon code.'));
            Mage::logException($e);
        }
        return $message;
    }

    public function kancart_shoppingcart_checkout() {
        $payment_id = $this->getRequest()->getParam('payment_method_id', null);
        try {
            if ($this->getQuote()->getGrandTotal() == 0) {
                $payment_id = 'free';
            }

            if ($payment_id === 'paypal') {
                $real_payment_id = 'paypal_standard';
            } else if ($payment_id === 'paypalwpp') {
                $real_payment_id = 'paypal_express';
            } else {
                $real_payment_id = $this->getRealKancartPaymentId($payment_id);  //money order
            }
            $data = $this->getRequest()->getPost('payment', array());
            $data['method'] = $real_payment_id;
            $this->getOnepage()->savePayment($data);

            if ($payment_id === 'paypal') {
                return Kancart::getModel('PayPalWPS')->buildPaypalWPSParams();
            } else if ($payment_id === 'paypalwpp') {
                return Kancart::getModel('PayPalEC')->kancart_shoppingcart_paypalec_start('commit');
            } else {
                return Kancart::getModel('Payment')->placeOrder($data, $payment_id);
            }
        } catch (Mage_Core_Exception $e) {
            return array(false, '0x9000', $e->getMessage());
        } catch (Exception $e) {
            return array(false, '0x9000', $e->getMessage());
        }
    }

    private function getRealKancartPaymentId($payment_id) {
        $priorsPayments = array(
            'banktransfer' => 0,
            'cashondelivery' => 1,
            'checkmo' => 2,
            'purchaseorder' => 3
        );

        $kcode = str_replace('kancart_', '', $payment_id);
        $kcode = str_replace('magePay-', '', $kcode);
        Mage::app()->getStore()->setConfig('payment/' . $kcode . '/active', true);
        Mage::app()->getStore()->setConfig('payment/checkmo/active', true); //Activation checkout Money payment
        $payments = array();
        $methods = $this->getAvailablePayment();
        if ($methods) {
            foreach ($methods as $method) {
                $code = $method->getCode();
                if ($kcode == $code) {
                    return $code;
                }
                if (isset($priorsPayments[$code])) {
                    $payments[$priorsPayments[$code]] = $code;
                }
            }
        }

        if (sizeof($payments) < 1) {
            Mage::throwException('No available offline payment method configured on Magento backend.');
        }

        ksort($payments);
        reset($payments);

        return current($payments);
    }

    /**
     * apply for offline payment
     */
    public function kancart_checkout_start() {
        $payment_id = $this->getRequest()->getParam('payment_method_id', null);
        $checkout_type = $this->getRequest()->getParam('checkout_type');
        if (Mage::getStoreConfig('payment/paypal_standard/active') < 1 && Kancart::helper('Data')->getFrontConfig('paypal_standard') > 0) {
            Mage::app()->getStore()->setConfig('payment/paypal_standard/active', true);
        }
        if (Mage::getStoreConfig('payment/paypal_express/active') < 1 && Kancart::helper('Data')->getFrontConfig('paypal_express') > 0) {
            Mage::app()->getStore()->setConfig('payment/paypal_express/active', true);
        }
        switch ($checkout_type) {
            case 'cart':
                if ($payment_id == 'paypalec') {
                    return Kancart::getModel('PayPalEC')->kancart_shoppingcart_paypalec_start();
                } else {
                    return $this->kancart_shoppingcart_checkout();
                }
                break;
            case 'order':
                break;
            default : break;
        }

        return array(FALSE, '0xFFFF', 'Unknow Error!');
    }

    /**
     * apply for offline payment
     */
    public function kancart_checkout_done() {
        $payment_id = $this->getRequest()->getParam('payment_method_id');
        $comment = $this->getRequest()->getParam('custom_kc_comments');
        $checkout_type = $this->getRequest()->getParam('checkout_type');
        switch ($checkout_type) {
            case 'cart':
                if ($payment_id == 'paypalwpp') {
                    return Kancart::getModel('PayPalEC')->kancart_shoppingcart_paypalec_pay($comment);
                } elseif ($payment_id == 'paypal') {
                    return Kancart::getModel('PayPalWPS')->kancart_shoppingcart_paypalwps_done();
                } else {
                    return Kancart::getModel('Payment')->kancart_payment_done(trim($_REQUEST['order_id']), $comment, $_REQUEST['payment_status']);
                }
                break;
            case 'order':
                break;
            default : break;
        }

        return array(FALSE, '0xFFFF', 'Unknow Error!');
    }

    public function getCustomer() {
        if (empty($this->_customer)) {
            $this->_customer = Mage::getSingleton('customer/session')->getCustomer();
        }
        return $this->_customer;
    }

    /**
     * 
     * @return Mage_Checkout_Model_Session
     */
    public function getCheckout() {
        if (empty($this->_checkout)) {
            $this->_checkout = Mage::getSingleton('checkout/session');
        }
        return $this->_checkout;
    }

    /**
     * 
     * @return Mage_Sales_Model_Quote
     */
    public function getQuote() {
        if (empty($this->_quote)) {
            $this->_quote = $this->getCheckout()->getQuote();
        }
        return $this->_quote;
    }

}