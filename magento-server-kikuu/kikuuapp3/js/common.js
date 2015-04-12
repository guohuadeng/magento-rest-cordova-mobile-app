// 全局事件处理，用于调试错误信息
window.onerror = function (e) {
//    alert(e);
};

// 全局事件处理
function initEvents() {
    // 返回
    $(document).on('click', '[data-role="back"]', function () {
        history.back();
    });

    // 菜单切换
    $('.menu-toggle, .menu-close, .menu-bottom').click(toggleMenu);
	
	$(".cbp-spmenu li a").click(function(){
		$('.menu-bottom').hide();
	});
	
    // 手机点击菜单按键
    document.addEventListener('menubutton', toggleMenu, false);

    // 二维码
    $(document).on('click', '.qrcode', function () {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                if (result.format === 'QR_CODE' && confirm(result.text)) {
                    if (result.text.indexOf('skymazon.sunpop.cn') !== -1) {
                        location.href = result.text;
                    } else {
                        navigator.app.loadUrl(result.text, {openExternal: true});
                    }
                }
            },
            function (error) {
                alert("Scanning failed: " + error);
            }
        );
    });

    // 分享
    $(document).on('click', '.share', function () {
        var $this = $(this).parents('.page');
        plugins.socialsharing.share($this.find('.title').text(), null, null,
            $this.find('iframe').attr('src'));
    });
}

// 切换菜单
function toggleMenu(e) {
    if (defines.state !== 'index') {
        return;
    }

    var $menu = $('.menu-toggle'),
        left = $('.cbp-spmenu').outerWidth() + 10;

    $menu.toggleClass('active');
    $('.cbp-spmenu-left').toggleClass('cbp-spmenu-open');
	
	$('.menu-bottom').toggle();
}

//绑定fastclick，更好处理tap,滚动的流畅度提升明显，因chrome浏览器操作原因，开发阶段关闭
//FastClick.attach(document.body);

// 内嵌的iFrame需要处理自己的url，所以临时加上
// 处理页面url传递的参数
function requestUrl(paras)
    { 
        var url = location.href; 
        var paraString = url.substring(url.indexOf('?')+1,url.length).split('&'); 
        var paraObj = {} 
        for (i=0; j=paraString[i]; i++){ 
        paraObj[j.substring(0,j.indexOf('=')).toLowerCase()] = j.substring(j.indexOf('=')+1,j.length); 
        } 
        var returnValue = paraObj[paras.toLowerCase()]; 
        if(typeof(returnValue)=='undefined'){ 
        return ''; 
        }else{ 
        return returnValue; 
        } 
    }