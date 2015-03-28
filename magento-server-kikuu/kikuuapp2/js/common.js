var isApp = false,
    baseUrl = isApp ? 'http://skymazon.sunpop.cn' : '',
    api = {
        products: baseUrl + '/api/rest/products?category_id=%s&limit=10&page=%s',
        product_detail: 'http://skymazon.sunpop.cn/catalog/product/view/id/'
    },
    menus = [{
        title: 'Home',
        class_name: 'active'
    }, {
        title: 'MOBILE AND TABLETS',
        url: 'http://skymazon.sunpop.cn/mobile-and-tablets.html?fromui=app'
    }, {
        title: 'WOMEN\'S FASHION',
        url: 'http://skymazon.sunpop.cn/womens-fashion.html?fromui=app'
    }, {
        title: 'MEN\'S FASHION',
        url: 'http://skymazon.sunpop.cn/mens-fashion.html?fromui=app'
    }, {
        title: 'BEAUTY AND HEALTH',
        url: 'http://skymazon.sunpop.cn/beauty-and-health.html?fromui=app'
    }, {
        title: 'BABY, KIDS AND TOYS',
        url: 'http://skymazon.sunpop.cn/baby-kids-and-toys.html?fromui=app'
    }, {
        title: 'FOODS AND WINES',
        url: 'http://skymazon.sunpop.cn/foods-and-wines.html?fromui=app'
    }, {
        title: '',
        class_name: 'table-view-divider',
        url: '#'
    }, {
        title: 'My Order',
        url: 'http://skymazon.sunpop.cn/sales/order/history/?fromui=app'
    }, {
        title: 'Cart',
        url: 'http://skymazon.sunpop.cn/?fromui=app#cart/'
    }, {
        title: 'Wish List',
        url: 'http://skymazon.sunpop.cn/wishlist/?fromui=app'
    }, {
        title: 'Address Book',
        url: 'http://skymazon.sunpop.cn/customer/address/?fromui=app'
    }],
    pages = [{
        id: 'wrapper',
        category_id: 127,
        title: 'Daily Sale',
        pullRefresh: true,
        num: 1
    }, {
        id: 'wrapper1',
        category_id: 128,
        title: 'Best Seller',
        pullRefresh: true,
        num: 1
    }, {
        id: 'wrapper2',
        category_id: 129,
        title: 'Coming Soon',
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
    if (state != 'index') {
        return;
    }
	//getIcon();
    var $menu = $('.menu-toggle'),
        left = $('.cbp-spmenu').outerWidth() + 10;

    $menu.toggleClass('active');
    $('body, header').css('left', $menu.hasClass('active') ? left : 0);
    $('header.bar').css('width', $menu.hasClass('active') ? '100%' : 'auto');
    $('.cbp-spmenu-left').toggleClass('cbp-spmenu-open');
}


/*-----------------------------------------------------------------------*/
function getIcon(){
		jQuery.ajax({
			url: 'http://skymazon.sunpop.cn/restconnect/?cmd=menu',
			// if "type" variable is undefined, then "GET" method will be used
			type: 'get',
			dataType: "json"
			//data: params
		}).done(function( responseData ) {
			jQuery.each(responseData,function (index,value){
				alert('icon:'+value['name']);
			});
			
			isApp. push([menu [responseData]]);
		});
	}
	