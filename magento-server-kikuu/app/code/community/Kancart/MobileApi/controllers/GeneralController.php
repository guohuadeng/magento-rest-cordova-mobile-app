<?php
define('KANCART_APP_KEY', '5TZP18AK');
define('KANCART_APP_SECRET','EGZIB2XW8FFMJJROJMUB6CUEGLS0AT44' );
define('MOBILE_API_ROOT', dirname(dirname(__FILE__)));
include(MOBILE_API_ROOT . DIRECTORY_SEPARATOR . 'Model' . DIRECTORY_SEPARATOR . 'ErrorHandler.php');
include(MOBILE_API_ROOT . DIRECTORY_SEPARATOR . 'Model' . DIRECTORY_SEPARATOR . 'Abstract.php');
class Kancart_MobileApi_GeneralController extends Mage_Core_Controller_Front_Action {
//需要/不需要接收的参数声明为私有成员
private static $instance=NULL;
private $apiUrls;
private $appKey;
private $appSecret;
private $languageCode;
private $currencyCode;
private $requestMethod;
private $responseFormat;
private $sessionKey;
private $sessionID;
private $apiVersion;

public function indexAction() {
		$param = $this->getRequest ()->getParams ();
 		
		$param['app_key']=Kancart::helper('CryptoUtil')->Crypto ( KANCART_APP_KEY, 'AES-256', KANCART_APP_SECRET, TRUE);
		$param['sign']=$this->createSign($param, KANCART_APP_SECRET);	

		var_dump($param);
		
}
	public function createSign(array $param, $secret) {
		unset($param['sign']);
		ksort($param); 
		reset($param);

		$tempStr = "";
		foreach ($param as $key => $value) {
			$tempStr = $tempStr . $key . $value;
		}
		$tempStr = $tempStr . KANCART_APP_SECRET;

		//KCLogger::Log($tempStr);
		return strtoupper(md5($tempStr));
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

}