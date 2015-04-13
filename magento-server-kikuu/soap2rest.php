<?php
$proxy = new SoapClient('http://skymazon.sunpop.cn/api/v2_soap/?wsdl'); // TODO : change url
$sessionId = $proxy->login('restapi', 'kikuu.restapi.123'); // TODO : change login and pwd if necessary

$result = $proxy->magentoInfo($sessionId);
var_dump($result);

