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
class Kancart_MobileApi_Model_PayPalWPS extends Kancart_MobileApi_Model_Abstract {

    protected $_methodType = 'paypal_standard';
    protected $_order;   /* @var $_order Mage_Sales_Model_Order */

    public function buildPaypalWPSParams() {
        $paypalParams = array();
        $payment = array('method' => 'paypal_standard');
        $requestData = $this->getRequest()->getParams();
        list($result, $msg) = $this->placeOrder($payment, $_REQUEST['custom_kc_comments']);
        //some error occurred during the saving order process
        if ($result === FALSE) {
            return array(false, '0x9000', $msg);
        }
        $checkOutSession = Mage::getSingleton('checkout/session');
        $checkOutSession->setPaypalStandardQuoteId($checkOutSession->getQuoteId());
        $standard = Mage::getModel('paypal/standard');
        foreach ($standard->getStandardCheckoutFormFields() as $field => $value) {
            $paypalParams[$field] = $value;
        }
        $paypalParams['bn'] = 'Kancart_SP_WPS';
        $paypalParams['shopping_url'] = $requestData['shoppingcart_url'];
        $paypalParams['return'] = $requestData['return_url'];
        $paypalParams['cancel_return'] = $requestData['cancel_url'];
        if (abs(intval($paypalParams['discount_amount'])) == 0) {
            // for mobile optimization
            unset($paypalParams['discount_amount']);
        }
        $paypalRedirectUrl = $standard->getConfig()->getPaypalUrl();

        return array(true, '0x0000', array('paypal_redirect_url' => $paypalRedirectUrl, 'paypal_params' => $paypalParams));
    }

    public function kancart_shoppingcart_paypalwps_done() {
        try {
            $session = Mage::getSingleton('checkout/session');
            $session->setQuoteId($session->getPaypalStandardQuoteId(true));
            $session->getQuote()->setIsActive(false)->save();

            $order = Mage::getModel('sales/order')->loadByIncrementId($this->getOnepage()->getCheckout()->getLastRealOrderId());
            $info = Kancart::getModel('Order')->getPaymentOrderInfo($order, $order->getIncrementId(), $order->getPayment()->getLastTransId());
            $session->clear();
            $cart = Mage::getSingleton('checkout/cart');
            $cart->getQuote()->setItemsCount(0);
        } catch (Mage_Core_Exception $e) {
            return array(false, '0x9000', $e->getMessage());
        } catch (Exception $e) {
            return array(false, '0x9000', $e->getMessage());
        }
        return array(true, '0x0000', $info);
    }

    /**
     * save order 2012-05-24
     * @return bool 
     */
    public function placeOrder($payment, $comment = 'from mobile') {
        $agreements = Mage::helper('checkout')->getRequiredAgreementIds();
        $request = $this->getRequest()
                ->setPost('payment', $payment)
                ->setActionName('index')
                ->setPost('agreement', array_fill_keys($agreements, true)); //skip agreements

        if (($formKey = Mage::getSingleton('core/session')->getFormKey())) {
            $this->getRequest()->setParam('form_key', $formKey);
        } else {
            $formKey = time();
            Mage::getSingleton('core/session')->setFormKey($formKey);
            $this->getRequest()->setParam('form_key', $formKey);
        }

        try {
            $response = Mage::app()->getResponse();
            $fileName = Mage::getModuleDir('controllers', 'Mage_Checkout') . DIRECTORY_SEPARATOR . 'OnepageController.php';
            if (file_exists($fileName)) {
                include $fileName;
                $controller = Mage::getControllerInstance('Mage_Checkout_OnepageController', $request, $response);
                $controller->saveOrderAction();
                $result = Mage::helper('core')->jsonDecode($response->getBody());

                if ($result['success']) {
                    $newOrderIncrementId = $this->getOnepage()->getCheckout()->getLastRealOrderId();
                    $newOrder = Mage::getModel('sales/order');
                    $newOrder->loadByIncrementId($newOrderIncrementId);
                    $newOrder->setQuote($this->getOnepage()->getQuote());
                    $newOrder->addStatusToHistory(false, $comment, false);
                    $newOrder->save();

                    return array(true, $newOrder);
                } else {
                    return array(false, $result['error_messages']);
                }
            } else {
                return array(false, 'File ' . $fileName . ' is not exist and Can\'t include OnepageController.php');
            }
        } catch (Exception $e) {
            return array(false, $e->getMessage());
        }
    }

}