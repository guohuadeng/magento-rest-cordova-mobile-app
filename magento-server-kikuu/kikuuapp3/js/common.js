var isApp = location.search.indexOf('debug') === -1,
    baseUrl = isApp ? 'http://skymazon.sunpop.cn' : '',
    api = {
        menus: baseUrl + '/restconnect/?cmd=menu',
        products: baseUrl + '/restconnect/?cmd=%s&limit=%s&page=%s',
//        product_detail: baseUrl + '/api/rest/products/'
        product_detail: baseUrl + '/catalog/product/view/id/'
    },
    pages = [{
        id: 'dailySale',
        cmd: 'daily_sale',
        title: 'Daily Sale',
        pullRefresh: true,
        num: 1
    }, {
        id: 'bestSeller',
        cmd: 'best_seller',
        title: 'Best Seller',
        pullRefresh: true,
        num: 1
    }, {
        id: 'comingSoon',
        cmd: 'coming_soon',
        title: 'Coming Soon',
        pullRefresh: true,
        num: 1
    }, {
        id: '121',
        cmd: 'catalog&categoryid=121',
        title: 'Mobile&Tablets',
        pullRefresh: true,
        num: 1
    }, {
        id: '122',
        cmd: 'catalog&categoryid=122',
        title: 'Women Fashion',
        pullRefresh: true,
        num: 1
    }, {
        id: '123',
        cmd: 'catalog&categoryid=123',
        title: 'Men Fashion',
        pullRefresh: true,
        num: 1
    }, {
        id: '165',
        cmd: 'catalog&categoryid=165',
        title: 'Jewelry',
        pullRefresh: true,
        num: 1
    }],
    state = 'index',
    define = {
        showWelcome: isApp,
        startTime: isApp ? 2000 : 0
    };

window.onerror = function (e) {
//    alert(e);
};

function initEvents() {
    $(document).on('click', '[data-role="back"]', function () {
        history.back();
    });

    $('.menu-toggle, .menu-close').click(toggleMenu);

    $(document).on('click', '.cbp-spmenu li a', function () {
        $(this).parent().addClass('active').siblings().removeClass('active');
        toggleMenu();
    });

    $(document).on('click', '.qrcode', function () {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                if (result.format === 'QR_CODE' && confirm(result.text)) {
                    if (result.text.indexOf('skymazon.sunpop.cn') !== -1) {
                        location.href = result.text;
                    } else {
                        navigator.app.loadUrl(result.text, {openExternal : true});
                    }
                }
            },
            function (error) {
                alert("Scanning failed: " + error);
            }
        );
    });

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

function toggleMenu(e) {
    if (state !== 'index') {
        return;
    }

    var $menu = $('.menu-toggle'),
        left = $('.cbp-spmenu').outerWidth() + 10;

    $menu.toggleClass('active');
    $('.cbp-spmenu-left').toggleClass('cbp-spmenu-open');
}