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
class Kancart_MobileApi_Model_PayPalEC extends Kancart_MobileApi_Model_Abstract {

    /**
     * Config mode type
     *
     * @var string
     */
    protected $_configType = 'paypal/config';

    /**
     * Config method type
     *
     * @var string
     */
    protected $_configMethod = Mage_Paypal_Model_Config::METHOD_WPP_EXPRESS;
    protected $_checkout = null;  //Mage_Paypal_Model_Config
    protected $_config = null;

    protected function _initCheckout() {
        $quote = $this->_getQuote();
        if (!$quote->hasItems() || $quote->getHasError()) {
            Mage::throwException(Mage::helper('paypal')->__('Unable to initialize Express Checkout.'));
        }
        if (is_null($this->_config)) {
            $this->_config = new Kancart_Paypal_Model_Config(array($this->_configMethod));
        }
        $this->_checkout = Mage::getSingleton('paypal/express_checkout', array(
                    'config' => $this->_config,
                    'quote' => $quote,
                ));
    }

    public function kancart_shoppingcart_paypalec_start($useraction = 'continue') {
        $requestData = $this->getRequest()->getParams();
        try {
            $this->_initCheckout();

            if ($this->_getQuote()->getIsMultiShipping()) {
                $this->_getQuote()->setIsMultiShipping(false);
                $this->_getQuote()->removeAllAddresses();
            }

            $customer = Mage::getSingleton('customer/session')->getCustomer();
            if ($customer && $customer->getId()) {
                $this->_checkout->setCustomerWithAddressChange(
                        $customer, $this->_getQuote()->getBillingAddress(), $this->_getQuote()->getShippingAddress()
                );
            }

            // giropay
            $this->_checkout->prepareGiropayUrls(
                    Mage::getUrl('checkout/onepage/success'), Mage::getUrl('paypal/express/cancel'), Mage::getUrl('checkout/onepage/success')
            );

            $token = $this->_checkout->start($requestData['return_url'], $requestData['cancel_url']);
            if ($token && $url = $this->_checkout->getRedirectUrl()) {
                $this->_initToken($token);
                $url .='&useraction=' . $useraction;
                return array(true, '0x0000', array('token' => $token, 'paypal_redirect_url' => $url));
            } else {
                return array(false, '0x9000', 'Token or paypal redirect url is empty.');
            }
        } catch (Mage_Core_Exception $e) {
            return array(false, '0x9000', $e->getMessage());
        } catch (Exception $e) {
            return array(false, '0x9000', $e->getMessage());
        }
    }

    public function kancart_shoppingcart_paypalec_detail() {
        try {
            $this->_initCheckout();
            $this->_checkout->returnFromPaypal($this->_initToken());
            return Kancart::getModel('Checkout')->shoppingCartCheckoutDetail();
        } catch (Mage_Core_Exception $e) {
            return array(false, '0x9000', $e->getMessage());
        } catch (Exception $e) {
            return array(false, '0x9000', $e->getMessage());
        }
    }

    public function kancart_shoppingcart_paypalec_pay($comments = 'From mobile') {
        try {
            $this->_initCheckout();
            if (!$this->_getQuote()->getPayment()->getAdditionalInformation(Mage_Paypal_Model_Express_Checkout::PAYMENT_INFO_TRANSPORT_PAYER_ID)) {
                $this->_checkout->returnFromPaypal($this->_initToken());
            }
            $this->_checkout->place($this->_initToken());
            $session = $this->_getCheckoutSession();
            $session->clearHelperData();

            // "last successful quote"
            $quoteId = $this->_getQuote()->getId();
            $session->setLastQuoteId($quoteId)->setLastSuccessQuoteId($quoteId);

            // an order may be created
            $order = $this->_checkout->getOrder();
            if ($order) {
                $session->setLastOrderId($order->getId())
                        ->setLastRealOrderId($order->getIncrementId());
                // as well a billing agreement can be created
                $agreement = $this->_checkout->getBillingAgreement();
                if ($agreement) {
                    $session->setLastBillingAgreementId($agreement->getId());
                }
            }
            $order->addStatusToHistory(false, $comments, false)->save();

            // recurring profiles may be created along with the order or without it
            $profiles = $this->_checkout->getRecurringPaymentProfiles();
            if ($profiles) {
                $ids = array();
                foreach ($profiles as $profile) {
                    $ids[] = $profile->getId();
                }
                $session->setLastRecurringProfileIds($ids);
            }

            $info = Kancart::getModel('Order')->getPaymentOrderInfo($order, $order->getIncrementId(), $order->getPayment()->getLastTransId());
            return array(true, '0x0000', $info);
        } catch (Mage_Core_Exception $e) {
            return array(false, '0x9000', $e->getMessage());
        } catch (Exception $e) {
            return array(false, '0x9000', $e->getMessage());
        }
    }

    /**
     * Search for proper checkout token in request or session or (un)set specified one
     * Combined getter/setter
     *
     * @param string $setToken
     * @return Mage_Paypal_ExpressController|string
     */
    protected function _initToken($setToken = null) {
        if (null !== $setToken) {
            if (false === $setToken) {
                // security measure for avoid unsetting token twice
                if (!$this->_getSession()->getExpressCheckoutToken()) {
                    Mage::throwException($this->__('PayPal Express Checkout Token does not exist.'));
                }
                $this->_getSession()->unsExpressCheckoutToken();
            } else {
                $this->_getSession()->setExpressCheckoutToken($setToken);
            }
            return $this;
        }
        if ($setToken = $this->getRequest()->getParam('token')) {
            if ($setToken !== $this->_getSession()->getExpressCheckoutToken()) {
                Mage::throwException($this->__('Wrong PayPal Express Checkout Token specified.'));
            }
        } else {
            $setToken = $this->_getSession()->getExpressCheckoutToken();
        }
        return $setToken;
    }

    private function _getSession() {
        return Mage::getSingleton('paypal/session');
    }

    /**
     * Return checkout session object
     *
     * @return Mage_Checkout_Model_Session
     */
    private function _getCheckoutSession() {
        return Mage::getSingleton('checkout/session');
    }

    /**
     * Return checkout quote object
     *
     * @return Mage_Sale_Model_Quote
     */
    private function _getQuote() {
        if (!$this->_quote) {
            $this->_quote = $this->_getCheckoutSession()->getQuote();
        }
        return $this->_quote;
    }

}

class Kancart_Paypal_Model_Config extends Mage_Paypal_Model_Config {

    public function __construct($params = array()) {
        parent::__construct($params);
    }

    public function getBuildNotationCode($countryCode = null) {
        return 'Kancart_SP_EC';
    }

}