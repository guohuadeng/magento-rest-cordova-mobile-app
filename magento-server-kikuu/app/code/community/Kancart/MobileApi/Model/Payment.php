<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

class Kancart_MobileApi_Model_Payment extends Kancart_MobileApi_Model_Abstract {

    /**
     * from mobile payment
     * @param array $payment
     */
    public function placeOrder($payment, $paymentId) {
        if (!$this->getOnepage()->getQuote()->hasItems()) {
            return array(false, '0x9000', 'ShoppingCart is empty.');
        }

        if (($title = $this->getRequest()->getParam('payment_method_name'))) {
            $comments = 'From mobile payment ' . $title;
        } else {
            $comments = 'From mobile payment ' . $paymentId;
        }
        $paypal = Kancart::getModel('PayPalWPS');
        list($result, $order) = $paypal->placeOrder($payment, $comments);
        if ($result === true) {
            $orderId = $this->getOnepage()->getCheckout()->getLastRealOrderId();
            $this->getOnepage()->getCheckout()->clear();
            $data = Kancart::getModel('Order')->getPaymentOrderInfo($order, $orderId);
            return array(true, '0x0000', $data);
        } else {
            return array(false, '0x9000', $order);
        }
    }

    public function kancart_payment_done($orderId, $comments, $state) {
        $order = Mage::getModel('sales/order')->loadByIncrementId($orderId);
        if ($order && $order->getId()) {
            if (($result = strtolower($state) == 'succeed')) {
                $state = $this->getRequest()->getParam('order_state', Mage_Sales_Model_Order::STATE_PROCESSING);
            } else {
                $state = Mage_Sales_Model_Order::STATE_PENDING_PAYMENT;
            }
            $title = $this->getRequest()->getParam('payment_method_name', $_REQUEST['payment_method_id']);
            if ($result) {
                $message = 'Your order has been paid on our mobile payment service ' . $title;
            } else {
                $message = 'Your order has been paid failed on our mobile payment service ' . $title;
            }
            $order->setState($state, TRUE, $comments);
            $order->save();
            $order->sendOrderUpdateEmail(TRUE, $message);
            $data = Kancart::getModel('Order')->getPaymentOrderInfo($order, $orderId);
            return array(true, '0x0000', $data);
        } else {
            return array(false, '0xFFFF', 'Error this order doesn\'t exist.');
        }
    }

}

?>
