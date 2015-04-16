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
	
    // 手机点击菜单按键
    document.addEventListener('menubutton', toggleMenu, false);

    // 手机点击返回菜单
    document.addEventListener('backbutton', function (e) {
        if (defines.state === 'index') {
            e.preventDefault();
            if (confirm('Are you sure to exit the Kikuu app?')) {
                navigator.app.exitApp();
            }
        } else {
            history.back();
        }
    }, false);

    // 二维码
    $(document).on('click', '.qrcode', function () {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                if (result.format === 'QR_CODE' && confirm(result.text)) {
                    if (result.text.indexOf(defines.baseUrl) !== -1) {
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

    // fix #12
    if (!$menu.hasClass('active')) {
        initUser();
    }

    $menu.toggleClass('active');
    $('.cbp-spmenu-left').toggleClass('cbp-spmenu-open');
	
	$('.menu-bottom').toggle();
}
//第一次进入
function checkFirstTime() {
    var $firstTime = $('#firstTime');

    if (!store('first-time')) {
        $firstTime.show();
        store('first-time', true);
        $('.enter-button').click(function () {
            $firstTime.remove();
        });
    } else {
        $firstTime.remove();
    }
}

//绑定fastclick，更好处理tap,滚动的流畅度提升明显，因chrome浏览器操作原因，开发阶段关闭
//FastClick.attach(document.body);
