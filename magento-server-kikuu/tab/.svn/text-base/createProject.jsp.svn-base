
<%@ page contentType="text/html; charset=utf-8"%>
<%@page import="java.text.SimpleDateFormat;" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>

<title>创建任务</title>
<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1">
 
 <script type="text/javascript" src="js/jquery-1.9.1.min.js"></script>
<script type="text/javascript" src="js/jquery.mobile-1.3.2.min.js"></script>
<script type="text/javascript" src="js/zepto_min.js"></script>
<script type="text/javascript" src="js/touchslider.js"></script>
<link rel="stylesheet" href="css/jquery.mobile-1.3.2.min.css" type="text/css"></link>
<script type="text/javascript">
	function saveProject() {
		var name = $("#name").val();
		var area = $("#area").val();
		var state= $("#state").val();
		var startTime = $("#startTime").val();
		var quarter = $("#quarter").val();
		//alert(name + "--" + area + "--" + state + "--" + startTime + "--" + quarter);
		$.ajax({
			type : "POST",
			url : "SaveProjectServlet",
			dataType : "html",
			data : {
				name : name,
				area : area,
				state : state,
				startTime : startTime,
				quarter : quarter
					},
			success : callBack
		});
	}
	function callBack(data) {
		if(data == "success") {
			localStorage.index= 1;
			window.location.href = "index.html";
		} else {
			$("#message").css("color", "red").html(data);					
		}
	}
	
</script>

</head>

<body>
	<div id="message"></div>
	<div data-role="header" data-id="hid" data-position="fixed">
		<h1>创建任务</h1>
		<a data-rel="back" data-role="button" data-icon="back"
			data-iconpos="notext" data-theme="b" data-inline="true">Back</a>

	</div>
		<div data-role="fieldcontain">
			<label for="textinput-disabled">任务名称</label> <input type="text"
				name="name" id="name" placeholder="请填写任务名称" value="">
		</div>


		<div data-role="fieldcontain">
			<label for="select-native-1">巡查区域</label> <select name="area"
				id="area">
				<option value="天河">天河</option>
				<option value="海珠">海珠</option>
				<option value="番禺">番禺</option>
				<option value="白云">白云</option>
			</select>
		</div>


		<div data-role="fieldcontain">
			<label for="select-native-1">巡查状态</label> <select name="state"
				id="state">
				<option value="准备中">准备中</option>
				<option value="巡查中">巡查中</option>
				<option value="巡查结束，资料归档">巡查结束，资料归档</option>
			</select>
		</div>
		<%
			String startTime = new SimpleDateFormat("yyyy-MM-dd")
			.format(new java.util.Date());
		%>
		<label for="startTime">创建日期</label> <input type="date" name="startTime"
			id="startTime" value="<%=startTime%>">

		<div data-role="fieldcontain">
			<label for="select-native-1">巡查季度</label> <select name="quarter"
				id="quarter">
				<option value="第1季度">第1季度</option>
				<option value="第2季度">第2季度</option>
				<option value="第3季度">第3季度</option>
				<option value="第4季度">第4季度</option>
				<option value="专项检查">专项检查</option>
			</select>
		</div>

		<input type="submit" value="提交" data-iconpos="right" data-theme="b"
			id="submit" onclick="saveProject()" data-ajax="false">
</body>
</html>
