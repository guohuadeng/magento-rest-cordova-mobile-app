<%@ page contentType="text/html; charset=utf-8"%>
<!DOCTYPE HTML>
<html>
<head>

<title>修改任务</title>
<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1">

 <script type="text/javascript" src="js/jquery-1.9.1.min.js"></script>

<script type="text/javascript">
$(document).bind("mobileinit", function(){ 
	
	var id = "${param.id } ";
	$.ajax({
		type : "POST",
		url : "QueryProjectServlet",
		dataType : "html",
		data :{id:id},
		success : callBack
	});	
	
	function callBack(data){
		var project = eval("{" + data + "}");
		var name = project[0].name;
		var area = project[0].area;
		var state = project[0].state;
		var startTime = project[0].startTime;
		var quarter = project[0].quarter;
		
		$("#update").on("click",function(event){
			$.ajax({
				type : "POST",
				url : "UpdateProjectServlet",
				dataType : "html",
				data : {
					id : id,
					name : $("#name").val(),
					area : $("#area").val(),
					state : $("#state").val(),
					startTime : $("#date").val(),
					quarter : $("#quarter").val()
				},
				success : function(data){
					if(data == "success") {
						localStorage.index= 1;
						window.location.href = "index.html";
					} else {
						$("#message").css("color", "red").html(data);	
					}
				}
			});
		});
		
		$("#name").attr("value",name).textinput();
		$("#date").attr("value",startTime).textinput();
		count=$("#area option").length;
		for ( var i = 0; i < count; i++) {
			if ($("#area").get(0).options[i].value == area) {
		 		$("#area").get(0).selectedIndex=i;
				$("#area").selectmenu("refresh");
				break;
			}
		}
		
		count = $("#state option").length;
		for ( var i = 0; i < count; i++) {
			if ($("#state").get(0).options[i].value == state) {
		 		$("#state").get(0).selectedIndex=i;
				$("#state").selectmenu("refresh");
				break;
			}
		}
		
		count = $("#quarter option").length;
		for ( var i = 0; i < count; i++) {
			if ($("#quarter").get(0).options[i].value == quarter) {
		 		$("#quarter").get(0).selectedIndex=i;
				$("#quarter").selectmenu("refresh");
				break;
			}
		}
	}
	
});
	
</script>

<script type="text/javascript" src="js/jquery.mobile-1.3.2.min.js"></script>
<link rel="stylesheet" href="css/jquery.mobile-1.3.2.min.css" type="text/css"></link>
</head>
<body>
<div data-role="header" data-id="hid" data-position="fixed">
				<h1>
					修改任务
				</h1>
				<a data-role="button" data-icon="back" data-iconpos="notext" data-theme="b" data-inline="true" data-rel="back">Back</a>
			</div>
		<input type="hidden" name="id" value="${param.id } ">
		<div id="message"></div>
		<div data-role="fieldcontain">
			<label for="name">任务名称</label> <input type="text"
				name="name" id="name">
		</div>
		<div data-role="fieldcontain">
			<label for="area">巡查区域</label> <select name="area" id="area"
				data-ajax="false">
				<option value="海珠">海珠</option>
				<option value="番禺">番禺</option>
				<option value="天河">天河</option>
				<option value="白云">白云</option>
			</select>
		</div>
		<div data-role="fieldcontain">
			<label for="state">巡查状态</label> <select name="state"
				id="state" data-ajax="false">
				<option value="准备中">准备中</option>
				<option value="巡查中">巡查中</option>
				<option value="巡查结束，资料归档">巡查结束，资料归档</option>
			</select>
		</div>
		<label for="date">创建日期</label> <input type="date" name="startTime"
			id="date" value="">
		<div data-role="fieldcontain">
			<label for="quarter">巡查季度</label> <select name="quarter"
				id="quarter" data-ajax="false">
				<option value="第1季度">第1季度</option>
				<option value="第2季度">第2季度</option>
				<option value="第3季度">第3季度</option>
				<option value="第4季度">第4季度</option>
				<option value="专项检查">专项检查</option>
			</select>
		</div>
		<button id="update" value="更新"></button>
</body>
</html>
