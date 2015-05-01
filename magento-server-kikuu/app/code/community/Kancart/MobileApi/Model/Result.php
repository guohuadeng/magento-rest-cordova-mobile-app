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
class Kancart_MobileApi_Model_Result extends Kancart_MobileApi_Model_Abstract {

    const STATUS_FAIL = 'fail';
    const STATUS_SUCCESS = 'success';
    const ERROR_0x0001 = 'Invalid API version (System)';
    const ERROR_0x0002 = 'Time error over 10min (System)';
    const ERROR_0x0003 = 'Invalid encryption method (System)';
    const ERROR_0x0004 = 'Invalid response format (System)';
    const ERROR_0x0005 = 'Invalid signature (System)';
    const ERROR_0xFFFF = 'Unknow error';
    const SHOPPING_CART = 'shopping_cart';
    const LOGIN = 'login';
    const CHECKOUT_REVIEW = 'checkout_review';

    protected $result;
    protected $code;
    protected $info;
    protected $fields;

    public function setSuccess($info = null) {
        $this->result = self::STATUS_SUCCESS;
        $this->code = '0x0000';
        $this->info = $info;

        if (Mage::registry('redirect_to_page')) {
            $this->info['redirect_to_page'] = Mage::registry('redirect_to_page');
        }
    }

    public function setError($code, $msg = null) {
        $this->result = self::STATUS_FAIL;
        $this->code = $code;
        $this->info = array();
        if (is_array($msg)) {
            $this->info['messages'] = $msg;
        } else {
            $this->info['errmsg'] = $msg;
        }
        if (is_null($this->info['errmsg'])) {
            $this->info['errmsg'] = self::ERROR_0xFFFF;
        }

        if (Mage::registry('redirect_to_page')) {
            $this->info['redirect_to_page'] = Mage::registry('redirect_to_page');
        }
    }

    public function returnResult() {
        $arr = array('result' => $this->result, 'code' => $this->code, 'info' => $this->info);
        if (PHP_VERSION >= '5.2.0') {
            return json_encode($arr);
        } else {
            return Zend_Json::encode($arr);
        }      
    }

}