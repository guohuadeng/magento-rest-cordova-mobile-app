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
class Kancart_MobileApi_Model_Order extends Kancart_MobileApi_Model_Abstract {

    public function kancart_orders_get() {
        $params = $this->getRequest()->getParams();
        $pageSize = $params['page_size'];
        $pageNo = $params['page_no'];

        if (!$this->isLoggedIn()) {
            return array(false, '0x0002', 'You need login first.');
        }

        try {
            $status = is_null($params['status']) ? Mage::getSingleton('sales/order_config')->getVisibleOnFrontStates() : explode(',', $params['status']);
            $collection = Mage::getResourceModel('sales/order_collection')
                    ->addFieldToSelect('*')
                    ->addFieldToFilter('customer_id', Mage::getSingleton('customer/session')->getCustomer()->getId())
                    ->addFieldToFilter('state', array('in' => $status))
                    ->setOrder('created_at', 'desc')
                    ->setPage($pageNo, $pageSize);
            $collection->load();
            $totalResults = $collection->getSize();
            $orders = $collection->getItems();
        } catch (Exception $e) {
            return array(false, '0x6003', $e->getMessage());
        }
        $ordersResult = array();
        foreach ($orders as $order) {
            $orderItem = $this->getOderBaseInfo($order);
            $orderItem['price_infos'] = $this->getOrderPriceInfo($order);
            $orderItem['order_items'] = $this->getOrderItems($order);
            $orderItem['order_status'] = $this->getOrderHistory($order, $orderItem);
            $ordersResult[] = $orderItem;
        }
        $finalResult = array();
        $finalResult['orders'] = $ordersResult;
        $finalResult['total_results'] = $totalResults;
        return array(true, '0x0000', $finalResult);
    }

    public function kancart_order_get() {
        $orderId = (int) $this->getRequest()->getParam('order_id');
        if (!$this->isLoggedIn()) {
            return array(false, '0x0002', 'You need login first.');
        }
        try {
            $order = Mage::getModel('sales/order')->loadByIncrementId($orderId);
            $orderItem = $this->getOderBaseInfo($order);
            $orderItem['price_infos'] = $this->getOrderPriceInfo($order);
            $orderItem['order_items'] = $this->getOrderItems($order, true);
            $orderItem['order_status'] = $this->getOrderHistory($order, $orderItem);
            $orderItem['shipping_address'] = $this->toAddressData($order->getShippingAddress());
            $orderItem['billing_address'] = $this->toAddressData($order->getBillingAddress());
            return array(true, '0x0000', array('order' => $orderItem));
        } catch (Exception $e) {
            return array(false, '0x6002', $e->getMessage());
        }
    }

    public function kancart_order_reorder() {
        if (!($orderId = (int) $this->getRequest()->getParam('order_id'))) {
            return array(false, '0x7000', 'Order id is empty.');
        }

        $order = Mage::getModel('sales/order')->loadByIncrementId($orderId);
        $customerId = Mage::getSingleton('customer/session')->getCustomerId();
        $availableStates = Mage::getSingleton('sales/order_config')->getVisibleOnFrontStates();
        if ($order->getId() && $order->getCustomerId() && ($order->getCustomerId() == $customerId) && in_array($order->getState(), $availableStates, $strict = true)) {
            $cart = Mage::getSingleton('checkout/cart');
            $items = $order->getItemsCollection();
            foreach ($items as $item) {
                try {
                    $cart->addOrderItem($item);
                } catch (Mage_Core_Exception $e) {
                    if (Mage::getSingleton('checkout/session')->getUseNotice(true)) {
                        Mage::getSingleton('checkout/session')->addNotice($e->getMessage());
                    } else {
                        Mage::getSingleton('checkout/session')->addError($e->getMessage());
                    }
                    $mesg = $e->getMessage();
                } catch (Exception $e) {
                    Mage::getSingleton('checkout/session')->addException($e, Mage::helper('checkout')->__('Cannot add the item to shopping cart.'));
                    $mesg = $e->getMessage();
                }
            }
            $cart->save();
            Mage::register('redirect_to_page', Kancart_MobileApi_Model_Result::SHOPPING_CART);
            $info = array('messages' => array($mesg));
            return array(true, '0x0000', $info);
        } else {
            return array(false, '0x7000', 'This order can\'t be reordered.');
        }
    }

    public function kancart_orders_count() {
        if (!$this->isLoggedIn()) {
            return array(false, '0x0002', 'You need login first.');
        }
        $collection = Mage::getResourceModel('sales/order_collection')
                ->addFieldToSelect('*')
                ->addFieldToFilter('customer_id', Mage::getSingleton('customer/session')->getCustomer()->getId())
                ->addFieldToFilter('state', array('in' => Mage::getSingleton('sales/order_config')->getVisibleOnFrontStates()));
        $ordersCounts = array(
            'order_counts' => array(
                array('status_ids' => 'all',
                    'status_name' => Mage::helper('Sales')->__('My Orders'),
                    'count' => $collection->getSize())
            )
        );
        return array(true, '0x0000', $ordersCounts);
    }

    public function kancart_order_cancel() {
        if (!$this->isLoggedIn()) {
            return array(false, '0x0002', 'You need login first.');
        }
        $orderId = (int) $this->getRequest()->getParam('order_id');
        $order = Mage::getModel('sales/order')->loadByIncrementId($orderId);
        try {
            $order->cancel();
            $order->save();
        } catch (Mage_Core_Exception $e) {
            return array(false, '0x6002', $e->getMessage());
        }
        list($result, $code, $orderInfo) = $this->kancart_order_get();
        return array(true, '0x0000', $orderInfo);
    }

    public function kancart_order_complete() {
        if (!$this->isLoggedIn()) {
            return array(false, '0x0002', 'You need login first.');
        }
        $orderId = (int) $this->getRequest()->getParam('order_id');
        $order = Mage::getModel('sales/order')->loadByIncrementId($orderId);
        try {
            $order->_checkState();
            $order->save();
        } catch (Mage_Core_Exception $e) {
            return array(false, '0x0002', $e->getMessage());
        }
        return array(true, '0x0000', 'true');
    }

    public function getOderBaseInfo(Mage_Sales_Model_Order $order) {
        $orderIfo = array('order_id' => $order->getIncrementId(),
            'display_id' => $order->getIncrementId(), //show id
            'uname' => $order->getCustomerFirstname() . ' ' . $order->getCustomerLastname(),
            'currency' => $order->getOrderCurrencyCode(),
            'shipping_insurance' => '',
            'shipping_method' => $this->getOrderShipping($order),
            'payment_method' => $this->getOrderPayment($order),
            'coupon' => $order->getCouponCode(),
            'order_status' => array(),
            'last_status_id' => $order->getStatusLabel(), //get current status from history
            'order_tax' => $order->getTaxAmount(),
            'allow_reorder' => Mage::helper('Sales/Reorder')->canReorder($order),
            'allow_cancel' => $order->canCancel(),
            'order_date_start' => $order->getCreatedAt(),
            'order_date_finish' => '',
            'order_date_purchased' => $order->getUpdatedAt());

        return $orderIfo;
    }

    private function getOrderShipping($order) {
        return array(
            'sm_id' => $order->getShippingMethod(),
            'sm_code' => $order->getShippingMethod(),
            'title' => $order->getShippingDescription(),
            'description' => $order->getShippingDescription(),
            'price' => $order->getShippingInclTax(),
            'currency' => $order->getOrderCurrencyCode()
        );
    }

    private function getOrderPayment($order) {
        $path = 'payment/' . $order->getPayment()->getMethod() . '/title';
        return array('pm_id' => $order->getPayment()->getMethod(),
            'title' => Mage::app()->getStore()->getConfig($path),
            'description' => '');
    }

    /**
     * get order items
     * @param type $order Mage_Sales_Model_Order
     * @return type
     */
    private function getOrderItems($order, $download = false) {
        $items = array();
        if ($download) {
            $this->getOrderDownloadProducts($order, $items);
        }
        foreach ($order->getAllVisibleItems() as $item) {
            if ($download && $item->getProductType() == 'downloadable') {
                continue;
            }
            $product = Mage::getModel('catalog/product')->load($item['product_id']);
            $items[] = array(
                'item_id' => $item->getId(),
                'display_id' => $item->getId(),
                'display_attributes' => $this->getOrderItemOptions($item->getProductOptions()),
                'item_title' => strip_tags($item->getName()),
                'thumbnail_pic_url' => (string) Mage::helper('catalog/image')->init($product, 'thumbnail')->resize(75),
                'qty' => intval($item->getQtyOrdered()),
                'price' => $item->getPrice(),
                'final_price' => $item->getPrice(),
                'post_free' => $item->getFreeShipping(),
                'virtual_flag' => $item->getIsVirtual());
        }

        return $items;
    }

    private function getOrderDownloadProducts($order, &$items) {
        $_products = array();
        $products = array();
        foreach ($order->getAllVisibleItems() as $item) {
            if ($item->getProductType() == 'downloadable') {
                if (!isset($products[(int) $item->getProductId()])) {
                    $products[$item->getProductId()] = Mage::getModel('catalog/product')
                            ->setStoreId(Mage::app()->getStore()->getId())
                            ->load($item->getProductId());
                }
                $_products[$item->getId()]['qty'] = intval($item->getQtyOrdered());
                $_products[$item->getId()]['product'] = $products[$item->getProductId()];
            }
        }

        if (sizeof($_products) < 1) {
            return;
        }

        $purchasedItems = array();
        $list = Mage::getBlockSingleton('Downloadable/Customer_Products_List');
        $purchased = $list->getPurchased();
        $block = Mage::getBlockSingleton('downloadable/catalog_product_links');
        foreach ($list->getItems() as $item) {
            if ($item->getPurchased()->getOrderId() == $order->getId()) {
                $item->setPurchased($purchased->getItemById($item->getPurchasedId()));
                $item->setQty($_products[$item->getOrderItemId()]['qty']);
                $item->setProduct($_products[$item->getOrderItemId()]['product']);
                $block->setProduct($item->getProduct());
                $links = $block->getLinks();
                preg_match('/\d+\.\d+/', $block->getFormattedLinkPrice($links[$item->getLinkId()]), $prices);
                $item->setPrice($prices[0]);
                $purchasedItems[] = $item;
            }
        }

        $arrtibute = Mage::helper('downloadable')->__('Date') . ': %s<br>' . Mage::helper('downloadable')->__('Status') . ': %s<br>' . Mage::helper('downloadable')->__('Remaining Downloads') . ': %s<br>Download Url: %s<br>';
        foreach ($purchasedItems as $item) {
            if ($item->getNumberOfDownloadsBought()) {
                $url = '<a href="' . $list->getDownloadUrl($item) . '" title="' . Mage::helper('downloadable')->__('Start Download') . '"' . ($list->getIsOpenInNewWindow() ? 'onclick="this.target=\'_blank\'">' : '>') . $item->getLinkTitle() . '</a>';
            } else {
                $url = '<a href="' . $item->getLinkUrl() . '" title="' . Mage::helper('downloadable')->__('Start Download') . '"' . ($list->getIsOpenInNewWindow() ? 'onclick="this.target=\'_blank\'">' : '>') . $item->getLinkTitle() . '</a>';
            }

            $items[] = array(
                'item_id' => $item->getOrderItemId(),
                'display_id' => $item->getOrderItemId(),
                'display_attributes' => sprintf($arrtibute, $list->formatDate($item->getPurchased()->getCreatedAt()), Mage::helper('downloadable')->__(ucfirst($item->getStatus())), $list->getRemainingDownloads($item), $url),
                'item_title' => $item->getPurchased()->getProductName(),
                'thumbnail_pic_url' => $item->getProduct()->getThumbnailUrl(),
                'qty' => (int) $item->getQty(),
                'price' => $item->getPrice(),
                'final_price' => $item->getPrice()
            );
        }
    }

    /**
     * Here the system call getVisibleStatusHistory(), but for the user can see
     * the order remarks information, now all orders from mobile show all status histories
     * @param type $order Mage_Sales_Model_Order
     * @param type $orderItem array()
     * @return type
     */
    private function getOrderHistory($order, &$orderItem) {
        $status = array();
        $postion = 0;
        $config = Mage::getSingleton('sales/order_config');
        foreach ($order->getAllStatusHistory() as $history) { //getVisibleStatusHistory() show all history for mobile order
            strtolower($history->getStatus()) == strtolower($order->getStatus()) && $orderItem['last_status_id'] = $history->getId();
            $label = $config->getStatusLabel($history->getStatus());
            $status[] = array(
                'status_id' => $history->getId(),
                'status_name' => $label,
                'display_text' => $label,
                'language_id' => Mage::app()->getStore()->getCode(),
                'date_added' => $history->getCreatedAt(),
                'comments' => Mage::helper('core')->escapeHtml($history->getComment()),
                'position' => $postion++);
        }

        return $status;
    }

    /**
     * xml=>layout/sales.xml template=>sales/order/totals.phtml
     * @see layout/sales.xml sales_order_view
     * @param type $order Mage_Sales_Model_Order
     * @return type
     */
    private function getOrderPriceInfo($order) {
        $PriceInfos = array();
        $position = 0;
        $block = Mage::getBlockSingleton('Sales/Order_Totals')->setOrder($order);
        $tax = Mage::getBlockSingleton('Tax/Sales_Order_Tax')->setOrder($order)->setNameInLayout('tax');
        $block->setChild($tax->getNameInLayout(), $tax)->toHtml();
        foreach ($block->getTotals() as $item) {
            $type = strtolower($item->getCode()) == 'grand_total' ? 'total' : $item->getCode();
            if ($item->getBlockName()) {
                $item->setLabel($this->__('Tax'));
                $item->setValue($order->getTaxAmount());
            }
            $PriceInfos[] = array(
                'title' => $item->getLabel(),
                'currency' => $order->getOrderCurrencyCode(),
                'type' => $type,
                'price' => $item->getValue(),
                'position' => $position++
            );
        }
        return $PriceInfos;
    }

    private function getOrderItemOptions($options) {
        array_shift($options);
        $attribute = array();
        foreach ($options as $value) {
            if (is_array($value)) {
                $attribute = $value;
                break;
            }
        }

        $result = '';
        foreach ($attribute as $option) {
            if (is_string($option['value'])) {
                $result .= ' - ' . $option['label'] . ':' . $option['value'] . '<br>';
            } else {
                foreach ($option['value'] as $value) {
                    $result .= ' - ' . $option['label'] . ':' . (empty($value['qty']) ? '' : $value['qty'] . ' x ') . $value['title'] . '<br>';
                }
            }
        }
        return $result;
    }

    public function getPaymentOrderInfo($order, $orderId = false, $tx = '') {
        $orderItem = array();

        if (!$this->isLoggedIn() && $order && $order->getId()) { //for guest checkout
            $session = Mage::getSingleton('customer/session');
            $orderIds = $session->getOrderIds();
            $new = true;
            if (!$orderIds) {
                $orderIds = array($order->getId());
            } elseif (!in_array($order->getId(), $orderIds)) {
                $orderIds[] = $order->getId();
            } else {
                $new = false;
            }

            if ($new) {
                $session->setOrderIds($orderIds);

                if ($order->getIsVirtual()) {
                    $address = $order->getBillingAddress();
                } else {
                    $address = $order->getShippingAddress();
                }
                $session->setGuestAddress($address->getData());
            }
        }

        if ($order) {
            $orderItem['display_id'] = $orderId;
            $orderItem['shipping_address'] = $this->getPaymentAddress($order);
            $orderItem['price_infos'] = $this->getPaymentPriceInfos($order);
            $orderItem['order_items'] = $this->getPaymentOrderItems($order);

            $total = $order->getGrandTotal();
            empty($total) && $total = $order->getPayment()->getAmountAuthorized();
            $currency = $order->getOrderCurrencyCode();
        } else {
            $currency = Mage::app()->getStore()->getCurrentCurrencyCode();
            $total = 0;
        }

        return array(
            'transaction_id' => $tx,
            'payment_total' => $total,
            'currency' => $currency,
            'order_id' => $orderId,
            'orders' => sizeof($orderItem) ? array($orderItem) : false
        );
    }

    public function getPaymentAddress($order) {
        if ($order->getIsVirtual()) {
            $address = $order->getBillingAddress();
        } else {
            $address = $order->getShippingAddress();
        }

        return $this->toAddressData($address);
    }

    public function getPaymentPriceInfos($order) {
        $info = array();

        $info[] = array(
            'type' => 'subtotal',
            'home_currency_price' => $order->getSubtotal()
        );

        $info[] = array(
            'type' => 'shipping',
            'home_currency_price' => $order->getShippingAmount()
        );

        $info[] = array(
            'type' => 'tax',
            'home_currency_price' => $order->getTaxAmount()
        );

        $info[] = array(
            'type' => 'total',
            'home_currency_price' => $order->getGrandTotal()
        );

        return $info;
    }

    public function getPaymentOrderItems($order) {
        $items = array();
        $products = $order->getAllVisibleItems();
        foreach ($products as $product) {
            $items[] = array(
                'order_item_key' => $product->getId(),
                'item_id' => $product->getProductId(),
                'item_title' => $product->getName(),
                'category_name' => '',
                'home_currency_price' => $product->getPrice(),
                'qty' => (int) $product->getQtyOrdered()
            );
        }

        return $items;
    }

}