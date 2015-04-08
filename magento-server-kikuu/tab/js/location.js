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