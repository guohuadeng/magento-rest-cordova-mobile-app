<?php
define ( 'KANCART_APP_KEY', '5TZP18AK' );
define ( 'KANCART_APP_SECRET', 'EGZIB2XW8FFMJJROJMUB6CUEGLS0AT44' );
define ( 'MOBILE_API_ROOT', dirname ( dirname ( __FILE__ ) ) );
include (MOBILE_API_ROOT . DIRECTORY_SEPARATOR . 'Model' . DIRECTORY_SEPARATOR . 'ErrorHandler.php');
include (MOBILE_API_ROOT . DIRECTORY_SEPARATOR . 'Model' . DIRECTORY_SEPARATOR . 'Abstract.php');
class Kancart_MobileApi_GeneralController extends Mage_Core_Controller_Front_Action {
	public function indexAction() {
		$param = $this->getRequest ()->getParams ();
		$httpResponse = $this->sendRequest ( 'POST',$param );
		echo  $httpResponse ;
	}
	function pushSystemParam(array &$param) {
		$param ["sign_method"] = "md5";
		$param ['client'] = "mobilesite";
		
		if (! isset ( $param ['language'] ))
			$param ["language"] = 'EN';
		if (! isset ( $param ['currency'] ))
			$param ["currency"] = "USD";
		if (! isset ( $param ['app_key'] ))
			$param ["app_key"] = KANCART_APP_KEY;
			// 用户会话码。无需用户登录的时候可以不传
			// if (isset($_SESSION[SESSION_SESSION_KEY]) && $_SESSION[SESSION_SESSION_KEY]) {
			// $param["session"] = $_SESSION[SESSION_SESSION_KEY];
			// } else {
			// $param["session"] = "";
			// }
			// 时间戳，格式为yyyy-mm-dd hh:mm:ss，例如：2008-01-25 20:23:30。HonestWalkerAPI服务端允许客户端请求时间误差为10分钟。
			// date_default_timezone_set("ETC/GMT-8");
		$timestamp = time ();
		$param ["timestamp"] = date ( "Y-m-d H:i:s", $timestamp );
		if (! isset ( $param ['format'] ))
			$param ["format"] = 'JSON';
		if (! isset ( $param ['v'] ))
			$param ["v"] = '1.1';
		if (! isset ( $param ['method'] ))
			$param ["method"] = "KanCart.Config.Get";
		$keys = '';
		foreach ( $param as $key => $value ) {
			$keys .= $key . ',';
		}
		$keys = substr ( $keys, 0, - 1 );
		// 计算签名
		$param ["sign"] = $this->createSign ( $param, KANCART_APP_SECRET );
		if ($param ["v"] != '1.0') {
			$param ['app_key'] = Kancart::helper ( 'CryptoUtil' )->Crypto ( KANCART_APP_KEY, 'AES-256', KANCART_APP_SECRET, TRUE );
		}
		return $param;
	}
	public function createSign(array $param, $secret) {
		unset ( $param ['sign'] );
		ksort ( $param );
		reset ( $param );
		$tempStr = "";
		foreach ( $param as $key => $value ) {
			$tempStr = $tempStr . $key . $value;
		}
		$tempStr = $tempStr . KANCART_APP_SECRET;
		return strtoupper ( md5 ( $tempStr ) );
	}
	/**
	 * 发送HTTP POST 请求
	 *
	 * @param string $methodName
	 *        	方法名称
	 * @param array $param
	 *        	请求参数
	 * @return string HTTPResponse
	 */
	function sendRequest($requestMethod,array $param) {
		// 添加系统参数
		//$param ["method"] = $methodName;
		// 添加系统参数
		// if (AGENT_STORE && ($methodName != "KanCart.Config.Get") && ($methodName != "KanCart.User.Feedback") && ($methodName != "KanCart.User.ImageURL") ) {
		// $this->appKey = AGENT_APP_KEY;
		// $this->appSecret = AGENT_APP_SECRET;
		// } else {
		// $this->appKey = APP_KEY;
		// $this->appSecret = APP_SECRET;
		// }
		
		// $param = $this->pushSystemParam($param);
		// $url = $this->apiUrls[$methodName];
		
		$param = $this->pushSystemParam ( $param );
		$url = 'http://demo.sunpop.cn/en/mobileapi';
		// Set the curl parameters.
		$ch = curl_init ();
		curl_setopt ( $ch, CURLOPT_FOLLOWLOCATION, 1 );
		curl_setopt ( $ch, CURLOPT_VERBOSE, 1 );
		// Turn off the server and peer verification (TrustManager Concept).
		curl_setopt ( $ch, CURLOPT_SSL_VERIFYPEER, FALSE );
		curl_setopt ( $ch, CURLOPT_SSL_VERIFYHOST, FALSE );
		
		curl_setopt ( $ch, CURLOPT_ENCODING, "" );
		
		curl_setopt ( $ch, CURLOPT_TIMEOUT, 90 );
		
		curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, 1 );
		// if USE_PROXY constant set to TRUE in Constants.php, then only proxy will be enabled.
		// Set proxy name to PROXY_HOST and port number to PROXY_PORT in constants.php
		// if(USE_PROXY)
		// define('PROXY_HOST', '192.168.1.201');
		// define('PROXY_PORT', '8118');
		// curl_setopt ($ch, CURLOPT_PROXY, PROXY_HOST.":".PROXY_PORT);
		// Set the request as a POST FIELD for curl.
		if ($requestMethod == 'POST') {
			curl_setopt ( $ch, CURLOPT_URL, $url );
			curl_setopt ( $ch, CURLOPT_POST, 1 );
			curl_setopt ( $ch, CURLOPT_POSTFIELDS, $param );
		} else {
			curl_setopt ( $ch, CURLOPT_URL, $url . '?' . $this->postData ( $param ) );
			curl_setopt ( $ch, CURLOPT_POST, 0 );
		}
		// Get response from the server.
		$httpResponse = curl_exec ( $ch );
		
		$findBOM = strpos ( $httpResponse, '{"' );
		if ($findBOM > 0) {
			$httpResponse = substr ( $httpResponse, $findBOM );
		}
		
		// KCLogger::Log("Response: " . $httpResponse);
		// KCLogger::Log("\r\n");
		
		return $httpResponse;
	}
	
	/**
	 * 组装普通文本请求参数
	 *
	 * @param array $param
	 *        	Key-Value形式请求参数字典(不包括参数sign)
	 * @return string 返回URL编码后的请求数据
	 */
	function postData(array $param) {
		$postStr = "";
		$hasPara = false;
		foreach ( $param as $key => $value ) {
			// 忽略参数名或参数值为空的参数
			if (! isEmptyString ( $key )) {
				if (is_numeric ( $value )) {
					$value = '' . $value;
				} else if (is_bool ( $value )) {
				} else if (isEmptyString ( $value )) {
					$value = "";
				}
				if ($hasPara) {
					$postStr = $postStr . "&";
				}
				$postStr = $postStr . $key . "=" . urlencode ( $value );
				$hasPara = true;
			}
		}
		return $postStr;
	}
	private function isEmptyString($string) {
		if (! is_string ( $string )) {
			return true;
		}
		if ($string == '0') {
			return false;
		}
		if (empty ( $string )) {
			return true;
		}
		return false;
	}
}
class Kancart {
	public static function getModel($fileName) {
		$path = MOBILE_API_ROOT . DIRECTORY_SEPARATOR . 'Model' . DIRECTORY_SEPARATOR . uc_words ( $fileName, DIRECTORY_SEPARATOR ) . '.php';
		if (file_exists ( $path )) {
			include_once ($path);
			$className = 'Kancart_MobileApi_Model_' . uc_words ( $fileName );
			Varien_Profiler::start ( 'CORE::create_object_of::' . $className );
			$obj = new $className ();
			Varien_Profiler::stop ( 'CORE::create_object_of::' . $className );
			
			return $obj;
		} else {
			throw new Exception ( 'file ' . $fileName . ' is not exist' );
		}
	}
	public static function getSingleton($fileName) {
		$registryKey = '_singleton/' . $fileName;
		if (! Mage::registry ( $registryKey )) {
			Mage::register ( $registryKey, self::getModel ( $fileName ) );
		}
		return Mage::registry ( $registryKey );
	}
	public static function helper($fileName) {
		$path = MOBILE_API_ROOT . DIRECTORY_SEPARATOR . 'Helper' . DIRECTORY_SEPARATOR . $fileName . '.php';
		if (file_exists ( $path )) {
			include_once ($path);
			$className = 'Kancart_MobileApi_Helper_' . uc_words ( $fileName );
			$obj = new $className ();
			
			return $obj;
		} else {
			throw new Exception ( 'file ' . $fileName . ' is not exist' );
		}
	}
}