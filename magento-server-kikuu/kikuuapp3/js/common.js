var isApp = location.search.indexOf('debug') === -1, // 默认为 app，方便测试桌面在 url 加上 ?debug
    baseUrl = isApp ? 'http://skymazon.sunpop.cn' : '',
    api = {
        menus: baseUrl + '/restconnect/?cmd=menu',
        products: baseUrl + '/restconnect/?cmd=%s&limit=%s&page=%s',
//        product_detail: baseUrl + '/api/rest/products/'
        products_rest: baseUrl + '/api/rest/products/',
        product_detail: baseUrl + '/catalog/product/view/id/'
    },
    pages = [
        {
            id: 'dailySale',
            cmd: 'daily_sale',
            title: 'Daily Sale',
            pullRefresh: true,
            num: 1
        },
        {
            id: 'bestSeller',
            cmd: 'best_seller',
            title: 'Best Seller',
            pullRefresh: true,
            num: 1
        },
        {
            id: 'comingSoon',
            cmd: 'coming_soon',
            title: 'Coming Soon',
            pullRefresh: true,
            num: 1
        }
    ],
    state = 'index',
    define = {
        showWelcome: isApp,
        startTime: isApp ? 2000 : 0
    };

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
    $('.menu-toggle, .menu-close').click(toggleMenu);
	
	$('.menu-toggle').click(function(){
		$('.menu-bottom').show();
	});
	$('.menu-close').click(function(){
		$('.menu-bottom').hide();
	});
	$('.menu-bottom').click(function(){
		$('.menu-close').click();
	});
	
    // 手机点击菜单按键
    document.addEventListener("menubutton", toggleMenu, false);

    // 菜单项点击
    $(document).on('click', '.cbp-spmenu li a', function () {
        $(this).parent().addClass('active').siblings().removeClass('active');
        $('.menu-bottom').hide();
        // 退出
        if ($(this).parent().hasClass('exit')) {
            navigator.app.exitApp();
        } else {
            toggleMenu();
        }
    });

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

function initViews() {
    setTimeout(function () {
        $('.start').hide();
        checkFirstTime();
    }, define.startTime);
}

function checkFirstTime() {
    var $firstTime = $('#firstTime');

    if (define.showWelcome && !store('first-time')) {
        $firstTime.show();
        store('first-time', true);
        $('.enter-button').click(function () {
            $firstTime.remove();
        });
    } else {
        $firstTime.remove();
    }
}

// 切换菜单
function toggleMenu(e) {
    if (state !== 'index') {
        return;
    }

    var $menu = $('.menu-toggle'),
        left = $('.cbp-spmenu').outerWidth() + 10;

    $menu.toggleClass('active');
    $('.cbp-spmenu-left').toggleClass('cbp-spmenu-open');
}
