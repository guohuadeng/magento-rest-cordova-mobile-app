<%@ page contentType="text/html; charset=utf-8"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>

<title>panel</title>
<script type="text/javascript">

    function loginOut(){
         localStorage.clear();
         
		$.get("LoginOutServlet", null, function(data) {
		    alert("退出成功 ");
			window.location.href="login.jsp";
	});


       }
    
    function saveLocation() {
    	$.mobile.loadingMessageTextVisible = true;    
    	$.mobile.showPageLoadingMsg( "a", "正在定位中..." ); 
    	//发送数据请求
    	//请求成功，显示好数据，隐藏掉进度条
    	if (navigator.geolocation) {
    		var options = { maximumAge: 3000, timeout: 10000, enableHighAccuracy: true };
			navigator.geolocation.getCurrentPosition(showPosition, showError,options);
		} else {
			alert("Geolocation is not supported by this browser.");
		}
	}

	function showPosition(position) {
		var latitude = position.coords.latitude;
		var longitude = position.coords.longitude;
		$.ajax({
			type : "POST",
			url : "SaveLocationServlet",
			dataType : "html",
			data : {
				latitude:latitude,
				longitude:longitude
					},
			success : function(data) {
				alert("您的位置保存成功！");
			}
		});
    	$.mobile.hidePageLoadingMsg();
	}

	function showError(error) {
	  switch(error.code) {
	    case error.PERMISSION_DENIED:
	     alert("您拒绝了定位请求！");
	      break;
	    case error.POSITION_UNAVAILABLE:
	      alert("地理信息无法获得，请检查您的网络！");
	      break;
	    case error.TIMEOUT:
	      alert("网络不给力哦，请稍后再试！");
	      break;
	    case error.UNKNOWN_ERROR:
	      alert("系统未知错误！");
	      break;
	    }
	   	$.mobile.hidePageLoadingMsg();
	  }
    



</script>
</head>

<body>
	<div data-role="panel" id="left-panel" data-theme="a"   >
		<ul data-role="listview" class="nav-search"  >
			<li  data-theme="a" data-role="list-divider" style="padding-top:15px; height: 30px;"><img src="img/tubiao.png"
				style="margin-top:10px;margin-left:15px; width: 40px;height: 32px;" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a
				style="margin-left:15px; font-size: 17px; text-decoration:none;" href="#" >工程监督</a></li>
			
			<li  data-theme="a" data-role="list-divider" style="padding-top:15px; height: 17px;"><img  src="img/touxiang.png"
				style="margin-top:10px;margin-left:20px; width: 50px;height: 50px;" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a
				style="margin-left:15px; font-size: 17px;"  onclick="loginOut()" >注销用户</a><span class="ui-li-aside" style="font-size: 12px;">您好，<script type="text/javascript">document.write(localStorage.nickName)</script>！</span></li>
			<li  data-theme="a" data-role="list-divider" style="padding-top:15px; height: 17px;"><img  src="img/touxiang.png"
				style="margin-top:10px;margin-left:20px; width: 50px;height: 50px;" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a
				style="margin-left:15px; font-size: 17px;"  onclick="loginOut()" >注销用户</a><span class="ui-li-aside" style="font-size: 12px;">您好，<script type="text/javascript">document.write(localStorage.nickName)</script>！</span></li>
			<li  data-theme="a" data-role="list-divider" style="padding-top:15px; height: 30px;"><img src="img/tubiao.png"
				style="margin-top:10px;margin-left:15px; width: 40px;height: 32px;" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a
				style="margin-left:15px; font-size: 17px; text-decoration:none;" href="#" >工程监督</a></li>
			<li data-theme="a" data-role="list-divider" style="padding-top:15px; height: 30px;"><img src="img/tubiao.png"
				style="margin-top:10px;margin-left:15px; width: 40px;height: 32px;" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a
				style="margin-left:15px; font-size: 17px; text-decoration:none;" href="#native">监督巡查</a></li>
			
			<li data-theme="a" data-role="list-divider" style="padding-top:15px; height: 30px;"><img src="img/tubiao.png"
				style="margin-top:10px;margin-left:15px; width: 40px;height: 32px;" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a
				style="margin-left:15px; font-size: 17px; text-decoration:none;"  href="#">安全生产管理</a></li>
				<li data-theme="a" data-role="list-divider" style="padding-top:15px; height: 30px;"><img src="img/tubiao.png"
				style="margin-top:10px;margin-left:15px; width: 40px;height: 32px;" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a
				style="margin-left:15px; font-size: 17px; text-decoration:none;"  href="#">监督机构及监督员管理</a></li>
				<li data-theme="a" data-role="list-divider" style="padding-top:15px; height: 30px;"><img src="img/tubiao.png"
				style="margin-top:10px;margin-left:15px; width: 40px;height: 32px;" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a
				style="margin-left:15px; font-size: 17px; text-decoration:none;"  href="#">监测监管</a></li>
				<li data-theme="a" data-role="list-divider" style="padding-top:15px; height: 30px;"><img src="img/tubiao.png"
				style="margin-top:10px;margin-left:15px; width: 40px;height: 32px;" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a
				style="margin-left:15px; font-size: 17px; text-decoration:none;"  href="#">从业人员查验</a></li>
				<li data-theme="a" data-role="list-divider" style="padding-top:15px; height: 30px;"><img src="img/tubiao.png"
				style="margin-top:10px;margin-left:15px; width: 40px;height: 32px;" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a
				style="margin-left:15px; font-size: 17px; text-decoration:none;"  href="#">起重设备及特种人员管理</a></li>
				<li data-theme="a" data-role="list-divider" style="padding-top:15px; height: 30px;"><img src="img/tubiao.png"
				style="margin-top:10px;margin-left:15px; width: 40px;height: 32px;" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a
				style="margin-left:15px; font-size: 17px; text-decoration:none;"  href="#">法律法规查询</a></li>
				<li data-theme="a" data-role="list-divider" style="padding-top:15px; height: 30px;"><img src="img/tubiao.png"
				style="margin-top:10px;margin-left:15px; width: 40px;height: 32px;" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a
				style="margin-left:15px; font-size: 17px; text-decoration:none;"  href="#">系统管理</a></li>
				<li data-theme="a" data-role="list-divider" style="padding-top:15px; height: 30px;"><img src="img/tubiao.png"
				style="margin-top:10px;margin-left:15px; width: 40px;height: 32px;" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a
				style="margin-left:15px; font-size: 17px; text-decoration:none;"  href="#" onclick="saveLocation()">我的位置</a></li>
		</ul>
	</div>
</body>
</html>
