<?php
//echo 'this is util outside';
define('MAGENTO_PLUGIN_VERSION', 'v2.1.2.1');
define('KANCART_APP_KEY', Mage::getStoreConfig('Kancart/Kancart_group/Kancart_appkey', Mage::app()->getStore()));
define('KANCART_APP_SECRECT', Mage::getStoreConfig('Kancart/Kancart_group/Kancart_appsecret', Mage::app()->getStore()));

var_dump(KANCART_APP_KEY);
var_dump(KANCART_APP_SECRECT);

if (Mage::getStoreConfig('Kancart/Kancart_group/Kancart_PaymentEnv', Mage::app()->getStore()) == 1)
    define('PAYPAL_ENVIRONMENT', 'live');
else
    define('PAYPAL_ENVIRONMENT', 'sandbox');
    
//var_dump(Mage::getStoreConfig('Kancart/Kancart_group/Kancart_PaymentEnv', Mage::app()->getStore()));

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
class Kancart_MobileApi_UtilController extends Kancart_MobileApi_Controller_Action {
 
     public function indexAction() {
//         date_default_timezone_set('UTC');
//         $request = $this->getRequest();
//         $result = Mage::getModel('mobileapi/Result');
// 		$appkey = Mage::helper('mobileapi/CryptoUtil')->Crypto($request->getParam('app_key'), 'AES-256', KANCART_APP_SECRECT, false);
// 		$_POST['app_key'] = $appkey;
// 		$_GET['app_key'] = $appkey;
//         if (!$request->getParam('app_key') || $request->getParam('app_key') != KANCART_APP_KEY) {
//             die('KanCart OpenAPI v1.1 is installed. Magento Plugin ' . MAGENTO_PLUGIN_VERSION);
//         }
//         if (!$request->getParam('v') OR $request->getParam('v') != '1.1') {
//             $result->setResult('0x0005');
//             $this->setResponseBody($result->returnResult());
//             return;
//         }
//         if (!$request->getParam('timestamp') || abs(time() - strtotime($request->getParam('timestamp'))) > 1800) {
//             $result->setResult('0x0003');
//             $this->setResponseBody($result->returnResult());
//             return;
//         }
//         if (!$request->getParam('sign_method') || $request->getParam('sign_method') != 'md5') {
//             $result->setResult('0x0006');
//             $this->setResponseBody($result->returnResult());
//             return;
//         }
//         if (!$request->getParam('sign') || !$this->validateRequestSign($request->getParams())) {
//             $result->setResult('0x0016');
//             $this->setResponseBody($result->returnResult());
//             return;
//         }
 
//         $session = Mage::getSingleton('customer/session');
//         $session = Mage::getSingleton('checkout/session');
 
//         Mage::app()->setCurrentStore(Mage::app()->getDefaultStoreView());
//         $returnData = '';
//         switch ($request->getParam('method')) {
//             case 'KanCart.User.Login' : $returnData = Mage::getModel('mobileapi/User')->Login($request->getParams());
//                 break;
//             case 'KanCart.User.Get' : $returnData = Mage::getModel('mobileapi/User')->Get($request->getParams());
//                 break;
//             case 'KanCart.User.Register' : $returnData = Mage::getModel('mobileapi/User')->Register($request->getParams());
//                 break;
//             case 'KanCart.User.Update' : $returnData = Mage::getModel('mobileapi/User')->Update($request->getParams());
//                 break;
//             case 'KanCart.User.Logout' : $returnData = Mage::getModel('mobileapi/User')->Logout();
//                 break;
//             case 'KanCart.User.IsExists' : $returnData = Mage::getModel('mobileapi/User')->IsExists($request->getParams());
//                 break;
//             case 'KanCart.User.Address.Update' : $returnData = Mage::getModel('mobileapi/User')->AddressSave($request->getParams());
//                 break;
//             case 'KanCart.User.Address.Remove' : $returnData = Mage::getModel('mobileapi/User')->AddressRemove($request->getParams());
//                 break;
//             case 'KanCart.User.Address.Add' : $returnData = Mage::getModel('mobileapi/User')->AddressSave($request->getParams());
//                 break;
//             case 'KanCart.User.Addresses.Get' : $returnData = Mage::getModel('mobileapi/User')->AddressesGet($request->getParams());
//                 break;
//             case 'KanCart.User.Address.Get' : $returnData = Mage::getModel('mobileapi/User')->AddressGet($request->getParams());
//                 break;
//             case 'KanCart.Countries.Get' : $returnData = Mage::getModel('mobileapi/Country')->getCountries($request->getParams());
//                 break;
//             case 'KanCart.Zones.Get' : $returnData = Mage::getModel('mobileapi/Zone')->getZones($request->getParams());
//                 break;
//             case 'KanCart.Currencies.Get' : $returnData = Mage::getModel('mobileapi/Currency')->getCurrencies($request->getParams());
//                 break;
//             case 'KanCart.Languages.Get' :
//                 break;
//             case 'KanCart.Category.Get' : $returnData = Mage::getModel('mobileapi/Category')->getCategories($request->getParams());
//                 break;
//             case 'KanCart.Item.Get' : $returnData = Mage::getModel('mobileapi/Item')->getItem($request->getParams());
//                 break;
//             case 'KanCart.Items.Get' : {
//                     $queryParam = str_replace('%20', ' ', $request->getParam('query'));
//                     $this->getRequest()->setParam(Mage::helper('catalogsearch')->getQueryParamName(), $queryParam);
//                     $returnData = Mage::getModel('mobileapi/Item')->getItems($request->getParams());
//                 } break;
//             case 'KanCart.ShoppingCart.Add' : $returnData = Mage::getModel('mobileapi/Cart')->ShoppingCartAdd($request->getParams());
//                 break;
//             case 'KanCart.ShoppingCart.Remove' : $returnData = Mage::getModel('mobileapi/Cart')->ShoppingCartRemove($request->getParams());
//                 break;
//             case 'KanCart.ShoppingCart.Get' : $returnData = Mage::getModel('mobileapi/Cart')->ShoppingCartGet();
//                 break;
//             case 'KanCart.ShoppingCart.Update' : $returnData = Mage::getModel('mobileapi/Cart')->ShoppingCartUpdate($request->getParams());
//                 break;
//             case 'KanCart.ShoppingCart.Checkout' : $returnData = Mage::getModel('mobileapi/Checkout')->ShoppingCartCheckout($request->getParams());
//                 break;
//             case 'KanCart.ShoppingCart.Checkout.Detail' : $returnData = Mage::getModel('mobileapi/Checkout')->ShoppingCartCheckoutDetail($request->getParams());
//                 break;
//             case 'KanCart.ShoppingCart.PayPalEC.Start' : $returnData = Mage::getModel('mobileapi/PayPalEC')->Start($request->getParams());
//                 break;
//             case 'KanCart.ShoppingCart.PayPalEC.Detail' : $returnData = Mage::getModel('mobileapi/PayPalEC')->Detail($request->getParams());
//                 break;
//             case 'KanCart.ShoppingCart.PayPalEC.Pay' : $returnData = Mage::getModel('mobileapi/PayPalEC')->Pay($request->getParams());
//                 break;
//             case 'KanCart.ShoppingCart.PayPalWPS.Done' : $returnData = Mage::getModel('mobileapi/PayPalWPS')->Done($request->getParams());
//                 break;
//             case 'KanCart.ShoppingCart.Addresses.Update' : $returnData = Mage::getModel('mobileapi/Checkout')->AddressUpdate($request->getParams());
//                 break;
//             case 'KanCart.ShoppingCart.ShippingMethods.Update' : $returnData = Mage::getModel('mobileapi/Checkout')->ShippingMethodsUpdate($request->getParams());
//                 break;
//             case 'KanCart.ShoppingCart.Coupons.Update' :
//                 break;
//             case 'KanCart.Order.Get' : $returnData = Mage::getModel('mobileapi/Order')->getOrder($request->getParams());
//                 break;
//             case 'KanCart.Orders.Get' : $returnData = Mage::getModel('mobileapi/Order')->getOrders($request->getParams());
//                 break;
//             case 'KanCart.Orders.Count' : $returnData = Mage::getModel('mobileapi/Order')->Count($request->getParams());
//                 break;
//             case 'KanCart.OrderStatuses.Get' : $returnData = Mage::getModel('mobileapi/OrderStatus')->getOrderStatuses($request->getParams());
//                 break;
//             case 'KanCart.Favoriate.Get' :
//                 break;
//             case 'KanCart.Favoriate.Add' :
//                 break;
//             case 'KanCart.Favoriate.Remove' :
//                 break;
//             case 'KanCart.TradeRates.Get' : $returnData = Mage::getModel('mobileapi/TradeRate')->getTradeRates($request->getParams());
//                 break;
//             case 'KanCart.TradeRate.Add' : $returnData = Mage::getModel('mobileapi/TradeRate')->addTradeRate($request->getParams());
//                 break;
//             case 'KanCart.Keywords.Get' :
//                 break;
//             default: $result->setResult('0x0018');
//                 $returnData = $result->returnResult();
//         }
//         $this->setResponseBody($returnData);
     }
 
//     private function setResponseBody($returnData) {
//         $this->getResponse()->setBody(Zend_Json::encode($returnData));
//     }
 
//     private function validateRequestSign(array $requestParams) {
//         if (!isset($requestParams['sign']) || $this->isEmptyString($requestParams['sign'])) {
//             return false;
//         }
//         $sign = $requestParams['sign'];
//         unset($requestParams['sign']);
//         ksort($requestParams);
//         reset($requestParams);
//         $tempStr = "";
//         foreach ($requestParams as $key => $value) {
//             $tempStr = $tempStr . $key . $value;
//         }
//         $tempStr = $tempStr . KANCART_APP_SECRECT;
//         return strtoupper(md5($tempStr)) === $sign;
//     }
 
//     private function isEmptyString($string) {
//         if (!is_string($string)) {
//             return true;
//         }
//         if ($string == '0') {
//             return false;
//         }
//         if (empty($string)) {
//             return true;
//         }
//         return false;
//     }
 
}

echo 'end of uitl outside';
?>