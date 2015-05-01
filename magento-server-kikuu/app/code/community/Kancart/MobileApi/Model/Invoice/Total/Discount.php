<?php

/**
 * Kancart MobileApi extension
 *
 * @category   kancart
 * @package    Kancart_MobileApi
 * @author     kancart <support@kancart.com>
 */
class Kancart_MobileApi_Model_Invoice_Total_Discount extends Mage_Sales_Model_Order_Invoice_Total_Abstract {

    public function collect(Mage_Sales_Model_Order_Invoice $invoice) {
        if (!Mage::helper('mobileapi')->isDiscountEnabled()) {
            return $this;
        }
        $order = $invoice->getOrder();
        if (!$order->getBaseMobileDiscount()) {
            return $this;
        }

        $invoiceBaseRemainder = $order->getBaseMobileDiscount() - $order->getBaseMobileInvoiced();
        $invoiceRemainder = $order->getMobileDiscount() - $order->getMobileInvoiced();
        $used = $baseUsed = 0;
        if ($invoiceBaseRemainder < $invoice->getBaseGrandTotal()) {
            $used = $invoiceRemainder;
            $baseUsed = $invoiceBaseRemainder;
            $invoice->setGrandTotal($invoice->getGrandTotal() - $used);
            $invoice->setBaseGrandTotal($invoice->getBaseGrandTotal() - $baseUsed);
        } else {
            $used = $invoice->getGrandTotal();
            $baseUsed = $invoice->getBaseGrandTotal();

            $invoice->setBaseGrandTotal(0);
            $invoice->setGrandTotal(0);
        }

        $order->setBaseDiscountAmount($order->getBaseDiscountAmount() + $baseUsed);
        $order->setDiscountAmount($order->getDiscountAmount() + $used);

        $invoice->setMobileDiscount($used);
        $invoice->setBaseMobileDiscount($baseUsed);

        return $this;
    }

}