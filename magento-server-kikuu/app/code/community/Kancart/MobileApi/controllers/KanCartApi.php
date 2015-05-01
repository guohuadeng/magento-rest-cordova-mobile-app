<?php
 echo '264';
 
//require_once('../KanCartAPI/util.php');
require_once('app/code/community/Kancart/MobileApi/controllers/IndexController.php');
 
/**
 * KanCartAPI API的核心部分，用于完成生成完成的请求，并返回响应
 * @author Jiawei
 * @version 1.0
 */
echo '196';
class KanCartAPI {
 
    /**
     * 单一实例
     * @var KanCartAPI
     */
    private static $instance = NULL;
 
    /**
     * api对应的url集合
     * @var array
     */
    private $apiUrls;
 
    /**
     * API应用的标志符 -- App Key
     * @var unknown_type
     */
    private $appKey;
 
    /**
     * API应用程序的密钥 -- App Secret
     * @var string
     */
    private $appSecret;
 
    public function getAppSecret() {
        if (AGENT_STORE) {
            return AGENT_APP_SECRET;
        } else {
            return $this->appSecret;
        }
    }
 
    /**
     * 语言（默认英语）
     * @var string
     */
    private $languageCode;
 
    /**
     * 币种（默认美元）
     * @var string
     */
    private $currencyCode;
 
    /**
     * 请求方法（默认POST）
     * @var string
     */
    private $requestMethod;
 
    /**
     * 返回的值类型(默认JSON)
     * @var string
     */
    private $responseFormat;
 
    /**
     * 用户登录标识
     * @var string
     */
    private $sessionKey;
 
    /**
     * 用户会话ID
     * @var string
     */
    private $sessionID;
 
    /**
     * api版本
     * @var string
     */
    private $apiVersion;
 
    /**
     * getInstance静态成员方法,获取此类的单一实例
     * @return KanCartAPI 唯一实例
     */
    public static function getInstance() {
        //如果对象实例还没有被创建，则创建一个新的实例
        if (is_null(self::$instance) || !isset(self::$instance)) {
            self::$instance = new self();
        }
        //返回对象实例
        return self::$instance;
    }
 
    /**
     * 构造函数，读取配置文件，获取各种配置
     */
    private function __construct() {
        $this->appKey = APP_KEY;
        $this->appSecret = APP_SECRET;
 
        $this->apiUrls = array();
        $this->apiUrls[BaseDAO::$KANCART_USER_LOGIN] = HTTPS_URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_USER_LOGOUT] = HTTPS_URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_USER_ISEXISTS] = URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_USER_REGISTER] = HTTPS_URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_USER_UPDATE] = HTTPS_URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_USER_GET] = HTTPS_URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_USER_ADDRESSES_GET] = HTTPS_URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_USER_ADDRESS_GET] = HTTPS_URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_USER_ADDRESS_ADD] = HTTPS_URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_USER_ADDRESS_REMOVE] = HTTPS_URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_USER_ADDRESS_UPDATE] = HTTPS_URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_ITEM_GET] = URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_ITEMS_GET] = URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_CATEGORY_GET] = URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_SHOPPINGCART_ADD] = URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_SHOPPINGCART_UPDATE] = URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_SHOPPINGCART_REMOVE] = URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_SHOPPINGCART_GET] = URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_SHOPPINGCART_CHECKOUT_DETAIL] = HTTPS_URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_SHOPPINGCART_CHECKOUT] = URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_SHOPPINGCART_PAYPALEC_PAY] = URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_SHOPPINGCART_PAYPALEC_START] = HTTPS_URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_SHOPPINGCART_PAYPALEC_DETAIL] = URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_SHOPPINGCART_PAYPALWPS_DONE] = URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_SHOPPINGCART_SHIPPINGMETHODS_UPDATE] = URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_SHOPPINGCART_SHIPPINGINSURANCES_UPDATE] = URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_SHOPPINGCART_ADDRESSES_UPDATE] = URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_SHOPPINGCART_COUPONS_UPDATE] = URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_ORDERS_GET] = HTTPS_URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_ORDERS_COUNT] = HTTPS_URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_ORDER_GET] = HTTPS_URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_ORDER_CHECKOUT] = HTTPS_URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_ORDER_PAYPALEC_PAY] = HTTPS_URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_ORDER_PAYPALWPS_DONE] = HTTPS_URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_ORDER_COMPLETE] = HTTPS_URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_ORDER_CANCEL] = HTTPS_URL_STRING;
        $this->apiUrls["KanCart.Favoriate.Get"] = URL_STRING;
        $this->apiUrls["KanCart.Favoriate.Add"] = URL_STRING;
        $this->apiUrls["KanCart.Favoriate.Remove"] = URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_TRADERATES_GET] = URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_TRADERATE_ADD] = URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_KEYWORDS_GET] = URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_ORDERSTATUSES_GET] = URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_LANGUAGES_GET] = URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_COUNTRIES_GET] = URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_ZONES_GET] = URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_CURRENCIES_GET] = URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_SESSIONID_GET] = URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_CONFIG_GET] = "http://service.kancart.com/server.php";
        $this->apiUrls[BaseDAO::$KANCART_USER_FORGOTPWD] = URL_STRING;
        $this->apiUrls[BaseDAO::$KANCART_USER_FEEDBACK] = "http://service.kancart.com/user_feedback.php";
 
        $this->languageCode = "EN";
        $this->currencyCode = "USD";
        $this->requestMethod = "POST";
        $this->responseFormat = "JSON";
        if (isset($_SESSION[SESSION_SESSION_KEY])) {
            $this->sessionKey = $_SESSION[SESSION_SESSION_KEY];
        } else {
            $this->sessionKey = ""; //"60c66e3d-c2a7-493c-ba49-fc2725eeba1d";
        }
        $this->apiVersion = API_VERSION;
    }
 
    /**
     * 通过计算返回KanCartAPI请求的签名
     * 第一步：移除参数中的key为sign的值(以防万一)
     * 第二步：按字典顺序将key排序(不区分大小写)
     * 第三步：按Key1Value1Key2Value2Key3Value3....的顺序将所有的键值按顺序拼接成一个字符串
     * 第四步：在该字符串末尾加上app_secret
     * 第五步：计算该拼接字符串的md5值(大写)
     * @param array $param 该请求的所有参数(不包括参数sign)
     * @param string $secret App_Secret
     * @return string 该拼接字符串的md5值(大写)
     */
    public function createSign(array $param, $secret) {
        // 第一步：移除参数中的key为sign的值(以防万一)
        unset($param["sign"]);
 
        // 第二步：按字典顺序将key排序(不区分大小写)
        ksort($param); //key值排序
        reset($param); //指针重新指向数组第一个
 
        // 第三步：按Key1Value1Key2Value2Key3Value3....的顺序将所有的键值按顺序拼接成一个字符串
        $tempStr = "";
        foreach ($param as $key => $value) {
            $tempStr = $tempStr . $key . $value;
        }
 
        // 第四步：在该字符串末尾加上app_secret
        $tempStr = $tempStr . $secret;
 
        //第五步：计算该拼接字符串的md5值(大写)
        KCLogger::Log($tempStr);
        return strtoupper(md5($tempStr));
    }
 
    /**
     * 加入系统级参数
     * @param array $param	 请求参数
     * @return array
     */
    function pushSystemParam(array &$param) {
        Global $currency, $lang;
        //默认语言
        if (isset($lang) && strlen($lang['id']) > 0) {
            $param["language"] = $lang['id'];
        } else {
            $param["language"] = 'EN';
        }
        //默认币种
        if ($currency && strlen($currency) > 2) {
            $param["currency"] = $currency;
        } else {
            $param["currency"] = "USD";
        }
 
        //店铺ID
        $param["app_key"] = $this->appKey;
 
        //用户会话码。无需用户登录的时候可以不传
        if (isset($_SESSION[SESSION_SESSION_KEY]) && $_SESSION[SESSION_SESSION_KEY]) {
            $param["session"] = $_SESSION[SESSION_SESSION_KEY];
        } else {
            $param["session"] = "";
        }
 
        //时间戳，格式为yyyy-mm-dd hh:mm:ss，例如：2008-01-25 20:23:30。HonestWalkerAPI服务端允许客户端请求时间误差为10分钟。
        $param["timestamp"] = date("Y-m-d H:i:s", getUTCDate());
 
        //响应格式。xml,json。
        $param["format"] = $this->responseFormat;
        //API版本号
        $param["v"] = $this->apiVersion;
        //签名类型
        $param["sign_method"] = "md5";
 
        $param['client'] = "mobilesite";
 
        //keys
        $keys = '';
        foreach ($param as $key => $value) {
            $keys .= $key . ',';
        }
        $keys = substr($keys, 0, - 1);
        // 计算签名
        $param["sign"] = $this->createSign($param, $this->appSecret);
 
        if ($this->apiVersion != '1.0') {
            $param['app_key'] = CryptoUtil::Crypto($param["app_key"], 'AES-256', $this->appSecret, true);
        }
 
        return $param;
    }
 
    /**
     * 发送HTTP POST 请求
     * @param string $methodName 方法名称
     * @param array $param 请求参数
     * @return string HTTPResponse
     */
    function sendRequest($methodName, array $param) {
        $param["method"] = $methodName;
        // 添加系统参数
        if (AGENT_STORE && ($methodName != "KanCart.Config.Get") && ($methodName != "KanCart.User.Feedback") && ($methodName != "KanCart.User.ImageURL") ) {
            $this->appKey = AGENT_APP_KEY;
            $this->appSecret = AGENT_APP_SECRET;
        } else {
            $this->appKey = APP_KEY;
            $this->appSecret = APP_SECRET;
        }
 
        $param = $this->pushSystemParam($param);
        $url = $this->apiUrls[$methodName];
 
        // Set the curl parameters.
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($ch, CURLOPT_VERBOSE, 1);
 
        // Turn off the server and peer verification (TrustManager Concept).
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
 
        curl_setopt($ch, CURLOPT_ENCODING, "");
 
        curl_setopt($ch, CURLOPT_TIMEOUT, 90);
 
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        //if USE_PROXY constant set to TRUE in Constants.php, then only proxy will be enabled.
        //Set proxy name to PROXY_HOST and port number to PROXY_PORT in constants.php
        //		if(USE_PROXY)
        //define('PROXY_HOST', '192.168.1.201');
        //define('PROXY_PORT', '8118');
        //curl_setopt ($ch, CURLOPT_PROXY, PROXY_HOST.":".PROXY_PORT);
        // Set the request as a POST FIELD for curl.
        if ($this->requestMethod == 'POST') {
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $param);
        } else {
            curl_setopt($ch, CURLOPT_URL, $url . '?' . $this->postData($param));
            curl_setopt($ch, CURLOPT_POST, 0);
        }
 
        KCLogger::Log("Request Url: " . $url . "?" . $this->postData($param));
        // Get response from the server.
        $httpResponse = curl_exec($ch);
 
        $findBOM = strpos($httpResponse, '{"');
        if ($findBOM > 0) {
            KCLogger::Log("===================================" . $findBOM);
            $httpResponse = substr($httpResponse, $findBOM);
        }
 
        KCLogger::Log("Response: " . $httpResponse);
        KCLogger::Log("\r\n");
 
        return $httpResponse;
    }
 
    /**
     * 组装普通文本请求参数
     * @param array $param Key-Value形式请求参数字典(不包括参数sign)
     * @return string 返回URL编码后的请求数据
     */
    function postData(array $param) {
        $postStr = "";
        $hasPara = false;
        foreach ($param as $key => $value) {
            // 忽略参数名或参数值为空的参数
            if (!isEmptyString($key)) {
                if (is_numeric($value)) {
                    $value = '' . $value;
                } else if (is_bool($value)) {
 
                } else if (isEmptyString($value)) {
                    $value = "";
                }
                if ($hasPara) {
                    $postStr = $postStr . "&";
                }
                $postStr = $postStr . $key . "=" . urlencode($value);
                $hasPara = true;
            }
        }
        return $postStr;
    }
 
}
 
// KanCartAPI.php end