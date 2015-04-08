//页面加载时加载全部数据
$("#projectList").empty();
$.ajax({
	type : "POST",
	url : "QueryProjectServlet",
	dataType : "html",
	success : callBack
});

//绑定查询全部事件
$("#all").click(function(event){
	$("#projectList").empty();
	$("#year").get(0).selectedIndex=0;
	$("#quarter").get(0).selectedIndex=0;
	$.ajax({
		type : "POST",
		url : "QueryProjectServlet",
		dataType : "html",
		success : callBack
	});
});

//绑定年份选择事件
$("#year").change(function(event){
	var year = $("#year").val();
	var quarter = $("#quarter").val();
	if(year != "" || quarter != "") {
		$("#projectList").empty();
		$.ajax({
			type : "POST",
			url : "QueryProjectServlet",
			dataType : "html",
			data : {
				year:year,
				quarter:quarter
					},
			success : callBack
		});
	} 
});

//绑定季度选择事件
$("#quarter").change(function(event){
	//alert("我被要求查询季度");
	var year = $("#year").val();
	var quarter = $("#quarter").val();
	
	if(year != "" || quarter != "") {
		$("#projectList").empty();
		$.ajax({
			type : "POST",
			url : "QueryProjectServlet",
			dataType : "html",
			data : {
				year:year,
				quarter:quarter
					},
			success : callBack
		});
	} 
});


function callBack(data) {
	var projects = eval("{" + data + "}");
	for ( var i = 0; i < projects.length; i++) {
		var project = projects[i];
		var newLi = $("<li>"); //创建li节点
		var updateProject = $("<a>"); //创建修改的a标签
		var deleteProject = $("<a>"); //创建删除的a标签
		// 创建各种属性
		if(project.name.length > 10) {
			var time = $("<p>").css("font-size", "10px").attr("align","right").html($("<strong>").html(project.startTime));
			var name = $("<p>").css("font-size", "15px").html($("<strong>").html("任务名称："+ project.name.substring(0,10) + "..."));


		} else {
			
			var name = $("<p>").css("font-size", "18px").html($("<strong>").html("任务名称："+ project.name));
			var time = $("<p>").css("font-size", "10px").attr("align","right").html($("<strong>").html(project.startTime));	
		}
		
		var quarter = $("<p>").css("color", "grey").html("季度："+ project.quarter);
		var state = $("<p>").css("color", "grey").html("任务状态："+ project.state);
		var area = $("<p>").css("color", "grey").html("巡查区域："+ project.area);
		//var startTime = $("<font>").html(project.startTime);
		
		//设置修改a标签的属性
		updateProject.attr("href","updateProject.jsp?id=" + project.id).attr("data-ajax","false");
			
		//设置删除a标签的属性
		deleteProject.attr("id",project.id).html($("<img>").attr("src","img/18.png"))
					 .bind("click",{id:project.id},function(event){
						 var del = confirm("确定删除！");
							if(del) {
								$.ajax({
									type : "POST",
									url : "DeleteProjectServlet",
									dataType : "html",
									data : {
										id : event.data.id
									},
									success : function(data){
										$("#projectList").empty();
										$.ajax({
											type : "POST",
											url : "QueryProjectServlet",
											dataType : "html",
											success : callBack
										});
									}
								});
							}
						});
		
		// 将属性追加到修改a标签
		updateProject.html(time);
		updateProject.append(name);
		updateProject.append(quarter);
		updateProject.append(state);
		updateProject.append(area);

		//将a标签追加到li节点
		updateProject.appendTo(newLi);
		deleteProject.appendTo(newLi);

		// 将li节点追加掉ul节点
		newLi.appendTo("#projectList");
	}
}