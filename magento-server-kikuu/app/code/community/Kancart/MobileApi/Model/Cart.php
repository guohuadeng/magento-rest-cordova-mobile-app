<?php

/**
 * KanCart
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http:
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
class Kancart_MobileApi_Model_Cart extends Kancart_MobileApi_Model_Abstract {

    private $errors = array();

    /**
     * get cart info
     * @param type $cartMessages
     * @return type
     */
    public function getCartInfo() {
        $cart = $this->_getCart();
        if ($cart->getQuote()->getItemsCount()) {
            $cart->init();
            $cart->save();
        }
        $cart->getQuote()->collectTotals()->save();
        $cartInfo = array();
        $cartInfo['is_virtual'] = Mage::helper('checkout/cart')->getIsVirtualQuote();
        $cartInfo['cart_items'] = $this->getCartItems();
        $cartInfo['messages'] = sizeof($this->errors) ? $this->errors : $this->getMessage();
        $cartInfo['cart_items_count'] = Mage::helper('checkout/cart')->getSummaryCount();
        $cartInfo['price_infos'] = $this->getPriceInfos();
        $cartInfo['payment_methods'] = $this->getPaymentInfo();
        $cartInfo['allow_guest_checkout'] = Mage::helper('checkout')->isAllowedGuestCheckout($cart->getQuote());

        return array(true, '0x0000', $cartInfo);
    }

    public function getCartItems() {
        $cartItemsArr = array();

        $quote = $this->_getCart()->getQuote();
        $currency = $quote->getquote_currency_code();
        $displayCartPriceInclTax = Mage::helper('tax')->displayCartPriceInclTax();
        $displayCartPriceExclTax = Mage::helper('tax')->displayCartPriceExclTax();
        $displayCartBothPrices = Mage::helper('tax')->displayCartBothPrices();
        foreach ($this->_getItems() as $item) {
            $renderer = $this->getItemRenderer($item);
            $cartItemArr = array();
            $cartItemArr['cart_item_id'] = $item->getId();
            $cartItemArr['currency'] = $currency;
            $cartItemArr['entity_type'] = $item->getProductType();
            $cartItemArr['item_id'] = $item->getProduct()->getId();
            $cartItemArr['item_title'] = strip_tags($item->getProduct()->getName());
            $cartItemArr['qty'] = $item->getQty();
            $cartItemArr['thumbnail_pic_url'] = (string) $renderer->getProductThumbnail()->resize(75);

            if ($displayCartPriceExclTax || $displayCartBothPrices) {
                if (Mage::helper('weee')->typeOfDisplay($item, array(0, 1, 4), 'sales') && $item->getWeeeTaxAppliedAmount()) {
                    $exclPrice = $item->getCalculationPrice() + $item->getWeeeTaxAppliedAmount() + $item->getWeeeTaxDisposition();
                } else {
                    $exclPrice = $item->getCalculationPrice();
                }
            }

            if ($displayCartPriceInclTax || $displayCartBothPrices) {
                $_incl = Mage::helper('checkout')->getPriceInclTax($item);
                if (Mage::helper('weee')->typeOfDisplay($item, array(0, 1, 4), 'sales') && $item->getWeeeTaxAppliedAmount()) {
                    $inclPrice = $_incl + $item->getWeeeTaxAppliedAmount();
                } else {
                    $inclPrice = $_incl - $item->getWeeeTaxDisposition();
                }
            }

            $cartItemArr['item_price'] = max($exclPrice, $inclPrice); //only display one
            $cartItemArr['display_attributes'] = $this->getDisplayAttribute($item, $renderer);

            array_push($cartItemsArr, $cartItemArr);
        }

        return $cartItemsArr;
    }

    private function getPaymentInfo() {
        $methods = $this->getAvailablePayment();
        foreach ($methods as $method) {
            if ($method->getCode() == 'paypal_express') {
                return array('paypalec');
            }
        }

        return array();
    }

    /**
     * Cart Item Render
     * @param type $product 
     */
    public function getDisplayAttribute(Mage_Sales_Model_Quote_Item $item, $renderer) {
        $optionsArr = '';
        if ($item->getProductType() == Mage_Downloadable_Model_Product_Type::TYPE_DOWNLOADABLE) {
            foreach ($renderer->getLinks() as $link) {
                $optionsArr .= $renderer->getLinksTitle() . ': ' . $link->getTitle() . '<br/>';
            }
        } else if ($_options = $renderer->getOptionList()) {
            foreach ($_options as $_option) {
                $_formatedOptionValue = $renderer->getFormatedOptionValue($_option);
                $optionsArr = $optionsArr . strip_tags($_option['label']) . ':' . strip_tags($_formatedOptionValue['value']) . '<br/>';
            }
        }

        return $optionsArr;
    }

    public function getProductRequestAttributes(&$error = array()) {
        $params = $this->getRequest()->getParams();
        $selectAttributes = array();
        if (isset($params['attributes']) && $params['attributes']) {
            $selectAttributes = json_decode($params['attributes'], true);
        }

        $dateArray = array('date', 'datetime', 'time');
        foreach ($selectAttributes as &$attribute) {
            if (in_array($attribute['input'], $dateArray)) {  //check data
                if (!$this->checkDateTime($attribute['value'])) {
                    $error[] = "The {$attribute['input']} format is not supported.";
                }
            };
        }

        return $selectAttributes;
    }

    public function kancart_shoppingcart_add() {
        $productId = (int) $this->getRequest()->getParam('item_id', 0);
        $qty = (int) $this->getRequest()->getParam('qty', 0);
        $related = $this->getRequest()->getParam('related_item', null);
        $cart = $this->_getCart();
        try {
            $product = null;
            if ($productId) {
                $_product = Mage::getModel('catalog/product')
                        ->setStoreId(Mage::app()->getStore()->getId())
                        ->load($productId);
                if ($_product->getId()) {
                    $product = $_product;
                }
            }
            if (!$product || !$product->getId()) {
                $this->errors[] = 'Invalid product id.';
                return $this->getCartInfo();
            }
            $params = array('qty' => $qty);
            $optionParam = $this->getAddToCartRequestParam($product->getTypeId(), $this->getProductRequestAttributes($this->errors));
            $cart->addProduct($product, array_merge($params, $optionParam));
            if (!empty($related)) {
                $cart->addProductsByIds(explode(',', $related));
            }
            if ($cart->getQuote()->getHasError()) {
                $mesg = current($cart->getQuote()->getErrors());
                Mage::throwException($mesg->getText());
            } else {
                $this->errors = array();
            }
            $cart->save();
            $this->_getSession()->setCartWasUpdated(true);
        } catch (Mage_Core_Exception $e) {
            $this->rollBack($productId, $qty);
            $this->errors[] = $e->getMessage();
        } catch (Exception $e) {
            $this->errors[] = $e->getMessage();
        }

        return $this->getCartInfo();
    }

    private function getAddToCartRequestParam($productType, array $attributes) {
        $params = array();
        // need sepcial treat for configurable product
        if ($productType == Mage_Catalog_Model_Product_Type::TYPE_CONFIGURABLE) {
            $superAttribute = array();
            $options = array();
            foreach ($attributes as $attribute) {
                if (strpos($attribute['attribute_id'], 'super_attribute_') === 0) {
                    $superAttribute[$this->getAttributeId('super_attribute', $attribute['attribute_id'])] = $attribute['value'];
                } else if (strpos($attribute['attribute_id'], 'option_') === 0) {
                    $value = '';
                    if ($attribute['input'] == 'multiple_select') {
                        $value = explode(',', $attribute['value']);
                    } else {
                        $value = $attribute['value'];
                    }
                    $options[$this->getAttributeId('option', $attribute['attribute_id'])] = $value;
                }
            }
            $params['options'] = $options;
            $params['super_attribute'] = $superAttribute;
        } else if ($productType == Mage_Downloadable_Model_Product_Type::TYPE_DOWNLOADABLE) {
            foreach ($attributes as $attribute) {
                $params[$attribute['attribute_id']] = explode(',', $attribute['value']);
            }
        } else {
            $at = array();
            $aqt = array();
            foreach ($attributes as $attribute) {
                if (is_array($attribute['value'])) {
                    $attribute_values = $attribute['value'];
                } else {
                    $attribute_values = explode(',', $attribute['value']);
                }
                if (count($attribute_values) > 1)
                    $at[$attribute['attribute_id']] = $attribute_values;
                else if (count($attribute_values) == 1) {
                    $at[$attribute['attribute_id']] = $attribute['value'];
                    $aqt[$attribute['attribute_id']] = $params['qty'];
                }
            }
            $params['options'] = $at;            // for simple productk
            $params['bundle_option'] = $at;      // for bundle product
            $params['bundle_option_qty'] = $aqt; // for bundle product
            $params['super_group'] = $at;        // for grouped product
        }

        return $params;
    }

    private function getAttributeId($type, $skuId) {
        $typeLen = strlen($type) + 1;
        $skuIdLength = strlen($skuId) - $typeLen;
        return substr($skuId, $typeLen, $skuIdLength);
    }

    public function kancart_shoppingcart_get() {
        return $this->getCartInfo();
    }

    public function kancart_shoppingcart_remove() {
        $id = (int) $this->getRequest()->getParam('cart_item_id', 0);
        if ($id) {
            try {
                $this->_getCart()->removeItem($id)->save();
                return $this->getCartInfo();
            } catch (Mage_Core_Exception $e) {
                $this->errors[] = $e->getMessage();
                return $this->getCartInfo();
            } catch (Exception $e) {
                $this->errors[] = $e->getMessage();
                return $this->getCartInfo();
            }
        } else {
            return array(false, '0x5002', 'Param cart_item_id is empty.');
        }
    }

    public function kancart_shoppingcart_update() {
        $itemId = (int) $this->getRequest()->getParam('cart_item_id', 0);
        $qty = (int) $this->getRequest()->getParam('qty', 0);
        $oldQty = 0;
        $item = null;
        try {
            if ($itemId && $qty > 0) {
                $cartData = array();
                $cartData[$itemId]['qty'] = $qty;
                $cart = $this->_getCart();
                /*                 * ****** if update fail rollback ********* */
                $item = $cart->getQuote()->getItemById($itemId);
                $oldQty = $item->getQty();
                if (!$cart->getCustomerSession()->getCustomer()->getId() && $cart->getQuote()->getCustomerId()) {
                    $cart->getQuote()->setCustomerId(null);
                }
                $cart->updateItems($cartData)->save();
                if ($cart->getQuote()->getHasError()) {// apply for 1.7.0.2
                    $mesg = current($cart->getQuote()->getErrors());
                    Mage::throwException($mesg->getText());
                }
            }
            $this->_getSession()->setCartWasUpdated(true);
        } catch (Mage_Core_Exception $e) {// rollback $quote->collectTotals()->save();
            $item && $item->setData('qty', $oldQty);
            $this->_getCart()->getQuote()->setTotalsCollectedFlag(false);  //reflash price
            $this->errors[] = $e->getMessage();
        } catch (Exception $e) {
            $this->errors[] = $e->getMessage();
        }

        return $this->getCartInfo();
    }

    public function rollBack($productId, $addQty) { // if add fail rollback
        foreach ($this->_getItems() as $item) {
            if ($item->getProduct()->getId() == $productId) {
                $oldQty = $item->getQty();
                $item->setQty($oldQty - $addQty);
            }
        }
    }

    public function checkDateTime(&$value) { // check date | time | datatime    
        if (!$value || !is_string($value)) {
            return false;
        }
        $value = trim($value);
        $date = date_parse($value);
        if (!$date['error_count']) {
            if (Mage::getStoreConfig('catalog/custom_options/use_calendar')) {
                $time = strtotime($value);
                $format = Mage::app()->getLocale()->getDateFormat(Mage_Core_Model_Locale::FORMAT_TYPE_SHORT);
                $value = array('date' => date($format, $time));
            } else {
                $value = array(
                    'year' => $date['year'],
                    'month' => $date['month'],
                    'day' => $date['day'],
                    'hour' => $date['hour'],
                    'minute' => $date['minute'],
                );
            }

            return true;
        }

        return false;
    }

    public function getMessage() {
        $cart = $this->_getCart();
        if (!$this->getOnepage()->getQuote()->hasItems()) {
            $this->errors[] = 'Cart is empty!';
            return $this->errors;
        }
        if (!$this->_getCart()->getQuote()->validateMinimumAmount()) {
            $warning = Mage::getStoreConfig('sales/minimum_order/description');
            $this->errors[] = $warning;
        }

        if (($messages = $cart->getQuote()->getErrors())) {
            foreach ($messages as $message) {
                if ($message) {
                    $this->errors[] = $message->getText();
                }
            }
        }

        return $this->errors;
    }

    public function _getSession() {
        return Mage::getSingleton('checkout/session');
    }

    protected function _getCart() {
        return Mage::getSingleton('checkout/cart');
    }

    public function _getItems() {
        return $this->_getCart()->getQuote()->getAllVisibleItems();
    }

}
