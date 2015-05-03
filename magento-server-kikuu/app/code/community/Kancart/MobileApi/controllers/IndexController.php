<?php

error_reporting(E_ALL ^ E_NOTICE);
define('KANCART_PLUGIN_VERSION', '2.1.2.1');
define('KANCART_APP_KEY', Mage::getStoreConfig('Kancart/Kancart_group/Kancart_appkey', Mage::app()->getStore()));
define('KANCART_APP_SECRET', Mage::getStoreConfig('Kancart/Kancart_group/Kancart_appsecret', Mage::app()->getStore()));
define('PRICE_INCLUDE_TAX', (boolean) Mage::getStoreConfig('Kancart/general/price_tax', Mage::app()->getStore()));
define('MOBILE_API_ROOT', dirname(dirname(__FILE__)));
include(MOBILE_API_ROOT . DIRECTORY_SEPARATOR . 'Model' . DIRECTORY_SEPARATOR . 'ErrorHandler.php');
include(MOBILE_API_ROOT . DIRECTORY_SEPARATOR . 'Model' . DIRECTORY_SEPARATOR . 'Abstract.php');

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
class Kancart_MobileApi_IndexController extends Mage_Core_Controller_Front_Action {

    private $response = null;

    public function indexAction() {
        $this->response = Kancart::getModel('Result');
        try {
            if ($this->validate()) {
                $this->init();
                list($result, $code, $response) = $this->getMobileResponse();
                if ($result === true) {
                    $this->response->setSuccess($response);
                } else {
                    $this->response->setError($code, $response);
                }
            }
            die($this->response->returnResult());
        } catch (Exception $e) {
            $this->response->setError('0x0013', $e->getMessage() . ' ' . $e->getTraceAsString());
            die($this->response->returnResult());
        }
    }

    public function init() {
        $currentStoreCode = Mage::app()->getStore()->getCode();
        $switchTo = (string) $this->getRequest()->getParam('language');
        if (isset($switchTo) && !empty($switchTo)) {
            if ($currentStoreCode != $switchTo) {
                $stores = Mage::app()->getStores(true, true);
                if (in_array($switchTo, array_keys($stores))) {
                    Mage::app()->setCurrentStore($switchTo);
                }
            }
        }
        if (($curency = (string) $this->getRequest()->getParam('currency'))) {
            Mage::app()->getStore()->setCurrentCurrencyCode($curency);
        }

        $this->compilerPlugin(); //To prevent  user backstage collapse after compiled 
    }

    public function validate() {
        if (defined('KC_DEBUG_MODE') && KC_DEBUG_MODE) {
            return true;
        }

        if (isset($_REQUEST['timestamp']) && !is_long($_REQUEST['timestamp'])) {
            $timezone = date_default_timezone_get();
            date_default_timezone_set('UTC');
            $_REQUEST['timestamp'] = strtotime($_REQUEST['timestamp']);
            date_default_timezone_set($timezone);
        }

        $appkey = isset($_REQUEST['app_key']) ? Kancart::helper('CryptoUtil')->Crypto($_REQUEST['app_key'], 'AES-256', KANCART_APP_SECRET, false) : false;
        $_POST['app_key'] = $appkey;
        if ($_POST['app_key'] != KANCART_APP_KEY) {
            die('KanCart OpenAPI v1.1 is installed on Magento v' . Mage::getVersion() . '. Magento Plugin v' . KANCART_PLUGIN_VERSION);
        }
        if (!isset($_REQUEST['v']) || $_REQUEST['v'] != '1.1') {
            $this->response->setError('0x0001', Kancart_MobileApi_Model_Result::ERROR_0x0001);
            return false;
        }
        if (!isset($_REQUEST['timestamp']) || abs(time() - intval($_REQUEST['timestamp'])) > 600) {
            $this->response->setError('0x0002', Kancart_MobileApi_Model_Result::ERROR_0x0002);
            return false;
        }
        if (!isset($_REQUEST['sign_method']) || $_REQUEST['sign_method'] != 'md5') {
            $this->response->setError('0x0003', Kancart_MobileApi_Model_Result::ERROR_0x0003);
            return false;
        }
        if (!isset($_POST['sign']) || !$this->validateRequestSign($_POST)) {
            $this->response->setError('0x0005', Kancart_MobileApi_Model_Result::ERROR_0x0005);
            return false;
        }
        return true;
    }

    public function getMobileResponse() {
        $arr = explode('.', strtolower($_REQUEST['method']));
        $map = array('orders' => 'Order', 'reviews' => 'Review');
        if ($arr[1] == 'shoppingcart') {
            if (strlen($arr[2]) < 7) {
                $fileName = 'Cart';
            } else if ($arr[2] == 'paypalec') {
                $fileName = 'PayPalEC';
            } else if ($arr[2] == 'paypalwps') {
                $fileName = 'PayPalWPS';
            } else {
                $fileName = 'Checkout';
            }
        } else {
            $fileName = isset($map[$arr[1]]) ? $map[$arr[1]] : ucfirst($arr[1]);
        }
        $instance = Kancart::getModel($fileName);
        $method = join('_', $arr);
        return $instance->$method();
    }

    private function validateRequestSign(array $requestParams) {
        if (!isset($requestParams['sign']) || !$requestParams['sign']) {
            return false;
        }
        $sign = $requestParams['sign'];
        unset($requestParams['sign']);
        unset($requestParams['XDEBUG_SESSION_START']);
        ksort($requestParams);
        reset($requestParams);
        $tempStr = "";
        foreach ($requestParams as $key => $value) {
            if (is_array($value)) {
                foreach ($value as $k => $v) {
                    $tempStr = $tempStr . $key . '[' . $k . ']' . $v;
                }
            } else {
                $tempStr = $tempStr . $key . $value;
            }
        }
        $tempStr = $tempStr . KANCART_APP_SECRET;
        return strtoupper(md5($tempStr)) === $sign;
    }

    private static function compilerPlugin() {
        if (defined('COMPILER_INCLUDE_PATH') && file_exists(COMPILER_INCLUDE_PATH) && !file_exists(COMPILER_INCLUDE_PATH . DIRECTORY_SEPARATOR . 'Kancart_MobileApi_Helper_Data.php')) {
            $fileName = MOBILE_API_ROOT . DIRECTORY_SEPARATOR . 'Helper' . DIRECTORY_SEPARATOR . 'Data.php';
            $dest = COMPILER_INCLUDE_PATH . DIRECTORY_SEPARATOR . 'Kancart_MobileApi_Helper_Data.php';
            file_exists($fileName) && copy($fileName, $dest);

            $fileName = MOBILE_API_ROOT . DIRECTORY_SEPARATOR . uc_words('Model_Quote_Total_Discount', DIRECTORY_SEPARATOR) . '.php';
            $dest = COMPILER_INCLUDE_PATH . DIRECTORY_SEPARATOR . 'Kancart_MobileApi_Model_Quote_Total_Discount.php';
            file_exists($fileName) && copy($fileName, $dest);

            $fileName = MOBILE_API_ROOT . DIRECTORY_SEPARATOR . uc_words('Model_Invoice_Total_Discount', DIRECTORY_SEPARATOR) . '.php';
            $dest = COMPILER_INCLUDE_PATH . DIRECTORY_SEPARATOR . 'Kancart_MobileApi_Model_Invoice_Total_Discount.php';
            file_exists($fileName) && copy($fileName, $dest);

            $fileName = MOBILE_API_ROOT . DIRECTORY_SEPARATOR . uc_words('Model_System_Config_Source_Allspecificstore', DIRECTORY_SEPARATOR) . '.php';
            $dest = COMPILER_INCLUDE_PATH . DIRECTORY_SEPARATOR . 'Kancart_MobileApi_Model_System_Config_Source_Allspecificstore.php';
            file_exists($fileName) && copy($fileName, $dest);

            $fileName = MOBILE_API_ROOT . DIRECTORY_SEPARATOR . uc_words('Model_System_Config_Source_Store', DIRECTORY_SEPARATOR) . '.php';
            $dest = COMPILER_INCLUDE_PATH . DIRECTORY_SEPARATOR . 'Kancart_MobileApi_Model_System_Config_Source_Store.php';
            file_exists($fileName) && copy($fileName, $dest);
        }
    }

}

class Kancart {

    public static function getModel($fileName) {
        $path = MOBILE_API_ROOT . DIRECTORY_SEPARATOR . 'Model' . DIRECTORY_SEPARATOR . uc_words($fileName, DIRECTORY_SEPARATOR) . '.php';
        if (file_exists($path)) {
            include_once($path);
            $className = 'Kancart_MobileApi_Model_' . uc_words($fileName);
            Varien_Profiler::start('CORE::create_object_of::' . $className);
            $obj = new $className();
            Varien_Profiler::stop('CORE::create_object_of::' . $className);

            return $obj;
        } else {
            throw new Exception('file ' . $fileName . ' is not exist');
        }
    }

    public static function getSingleton($fileName) {
        $registryKey = '_singleton/' . $fileName;
        if (!Mage::registry($registryKey)) {
            Mage::register($registryKey, self::getModel($fileName));
        }
        return Mage::registry($registryKey);
    }

    public static function helper($fileName) {
        $path = MOBILE_API_ROOT . DIRECTORY_SEPARATOR . 'Helper' . DIRECTORY_SEPARATOR . $fileName . '.php';
        if (file_exists($path)) {
            include_once($path);
            $className = 'Kancart_MobileApi_Helper_' . uc_words($fileName);
            $obj = new $className();

            return $obj;
        } else {
            throw new Exception('file ' . $fileName . ' is not exist');
        }
    }

} 