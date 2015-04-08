function loginOut() {
	localStorage.clear();
	$.get("LoginOutServlet", null, function(data) {
		alert("退出成功 ");
		window.location.href = "login.html";
	});
}

$(document).ready(function() {
	if (localStorage.index) {
		go(localStorage.index);
		localStorage.removeItem("index");

	}
	$("#menu").load("menu.html");
	$("#native").load("native.html");

	$("#engineeredManage").load("engineeredManage.html");
	$("#engineeredStat").load("engineeredStat.html");
	$("#safeStat").load("safeStat.html");
});

$(function() {
	$("#openMenuBtn").click(function() {
		showMenu();
	});
	$("#mask").bind("click", function() {// 轻触
				hideMenu();
				return false;
			});
	$("#mask").swipeLeft(function() {
		hideMenu();
	});
});
function showMenu() {
	$("#menu").css("display", "block");
	$("#content").css( {
		'-webkit-transform' : 'translate(250px)',
		'-webkit-transition' : '500ms linear'
	});
	$("#mask").css('display', "inline");
}
function hideMenu() {
	$("#content").css( {
		'-webkit-transform' : 'translate(0px)',
		'-webkit-transition' : '500ms linear'
	});
	$("#mask").css('display', "none");
}

var page = 'pagenavi1';

var mslide = 'slider1';

var mtitle = 'emtitle1';

arrdiv = 'arrdiv1';
var flag = -1;
var as = document.getElementById(page).getElementsByTagName('a');
var taskManageIndex = true;// 判断第二个页面加载一次
var myScroll;
var tt = new TouchSlider( {
	id : mslide,
	'auto' : '-1',
	fx : 'ease-out',
	direction : 'left',
	speed : 600,
	timeout : 5000,
	'before' : function(index) {
		var as = document.getElementById(this.page).getElementsByTagName('a');
		// alert("p"+this.p +";;index:" +index+"="+offx);

	as[this.p].className = '';
	as[index].className = 'active';
	np = this.p;
	nindex = index;
	this.p = index;

},
'after' : function(nindex) {
	if (nindex == 1) {
		if (taskManageIndex == true) {
			$("#taskManage").load("taskManage.html", function() {
				document.addEventListener('touchmove', function(e) {
					
					if(myScroll==null){
						myScroll = new iScroll('wrapper');
					}
						e.preventDefault();
					}, false);
			});
			taskManageIndex = false;
		}
	}
	if (np == 0 && offx > 0 && nindex == 0) {

		flag = nindex;
		if (flag == 0) {
			showMenu();
			flag = -1;
			// as[index].className = 'active';
	this.p = index;
	return false;
}

}

}
});
tt.page = page;
tt.p = 0;
for ( var i = 0; i < as.length; i++) {
	(function() {
		var j = i;
		as[j].tt = tt;
		as[j].onclick = function() {
			this.tt.slide(j);
			return false;
		}
	})();
}
function go(i) {
	as[i].tt = tt;
	this.tt.slide(i);
	return false;

}
