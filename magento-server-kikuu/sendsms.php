<?php

$smsurl = 'http://m.5c.com.cn/api/send/';
$username = 'shangpeng';
$password = 'qwer1234';
$mobile = $_REQUEST['mobile'];
$content = $_REQUEST['content'];

print_r($smsurl.'?username='.$username.'&passowrd='.$password.'&apikey=40ef302527761399cd81d9597902ffa5&mobile='.$mobile.'&content='.$content);
// 初始化一个 cURL 对象 
$curl = curl_init(); 
// 设置你需要抓取的URL 
curl_setopt($curl, CURLOPT_URL, $smsurl.'?username='.$username.'&password='.$password.'&apikey=40ef302527761399cd81d9597902ffa5&mobile=+86'.$mobile.'&content='.$content); 
// 设置header 响应头是否输出
curl_setopt($curl, CURLOPT_HEADER, 1); 
// 设置cURL 参数，要求结果保存到字符串中还是输出到屏幕上。
// 1如果成功只将结果返回，不自动输出任何内容。如果失败返回FALSE 
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 0); 
// 运行cURL，请求网页 
$data = curl_exec($curl); 
// 关闭URL请求 
curl_close($curl); 
// 显示获得的数据 
//print_r($data);
?>