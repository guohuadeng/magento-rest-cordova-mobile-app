var isApp = false,
    baseUrl = isApp ? 'http://skymazon.sunpop.cn' : '',
    api = {
        menus: baseUrl + '/restconnect/?cmd=menu',
        products: baseUrl + '/restconnect/?cmd=%s&limit=10&page=%s',
//        product_detail: baseUrl + '/api/rest/products/'
        product_detail: 'http://skymazon.sunpop.cn/catalog/product/view/id/'
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
        title: 'Mobile & Tablets',
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
    $(document).on('click', '.cbp-spmenu a', toggleMenu);
}

function initViews() {
    setTimeout(function () {
        $('.start').hide();
        checkFirstTime();
    }, define.startTime);

    $('.menu-toggle, .menu-close').click(toggleMenu);

    $('.qrcode').click(function () {
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

    var $detailModal = $('#detailModal');
    $detailModal.find('.share').click(function () {
        plugins.socialsharing.share($detailModal.find('.title').text(), null, null,
            $detailModal.find('iframe').attr('src'));
    });
    $(document).on('click', '.detail-link', function () {
        $detailModal.find('.title').text($(this).data('title'));
        $detailModal.find('iframe').attr('src', api.product_detail + $(this).data('id'));
    });
    $detailModal.on('modalOpen', function () {
        state = 'detail';
    });
    $detailModal.on('modalClose', function(e) {
        $detailModal.find('iframe').attr('src', '').hide();
        setTimeout(function () {
            state = 'index';
        }, 1000);
    });
    $detailModal.find('iframe').load(function() {
        $(this).show();
    });
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