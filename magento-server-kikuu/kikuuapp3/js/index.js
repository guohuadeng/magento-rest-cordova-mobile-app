function ready() {
    var currentPage = 0,
        $menuTpl = $('#menu-template'),
        $slideTpl = $('#slide-template'),
        $itemTpl = $('#item-template'),
        $detailTpl = $('#detail-template');

    function showMenus() {
        $.getJSON(api.menus, function (res) {
            var menus = [{
                name: 'Home',
                class_name: 'active'
            }];
            $.each(res, function (i, item) {
                item.url = '#' + item.category_id;
            });
            menus = menus.concat(res);
            menus.push({
                name: '',
                class_name: 'table-view-divider',
                url: '#'
            }, {
                name: 'My Order',
                url: 'detail.html?url=http://skymazon.sunpop.cn/sales/order/history/?fromui=app'
            }, {
                name: 'Cart',
                url: 'detail.html?url=http://skymazon.sunpop.cn/?fromui=app#cart/'
            }, {
                name: 'Wish List',
                url: 'detail.html?url=http://skymazon.sunpop.cn/wishlist/?fromui=app'
            }, {
                name: 'Setting',
                url: 'detail.html?url=http://skymazon.sunpop.cn/#account/?fromui=app'
            });
            $('.cbp-spmenu-list').html(Handlebars.compile($menuTpl.html())({
                menus: menus
            }));
        });
    }

    function showPages() {
        $.each(pages, function (i, page) {
            $('.swiper-container .swiper-wrapper').append(sprintf(
                '<a href="#%s" data-rel="auto" class="swiper-slide bullet-item">%s</a>',
                page.id, page.title));
        });
        new Swiper('.swiper-container', {
            slidesPerView: 2.5
        });

        $('.bullet-item').click(function () {
            var $this = $(this);
            $this.addClass('bullet-item-active')
                .siblings().removeClass('bullet-item-active');
            setTimeout(function () {
                $($this.attr('href')).data('scroll').refresh();
            }, 500);
        });

        $('#pageScroller').html(Handlebars.compile($slideTpl.html())({
                menus: pages
            })).find('.products-grid').each(function () {
                initItems($(this), 'html');
            });
    }

    function initItems($el, func, callback) {
        var page = pages[$el.parents('.page').index()],
            $page = $('#' + page.id),
            items = [];

        page.num = func === 'html' ? 1 : page.num + 1;

        $.ajax({
            type: 'get',
            url: sprintf(api.products, page.cmd, page.num),
            contentType: 'application/json',
            dataType: 'json',
            success: function (list) {
                var items = $.map(list, function (item) {
                    var fromDate = new Date(moment(item.special_from_date, 'YYYY-MM-DD HH:mm:ss')),
                        toDate = new Date(moment(item.special_to_date, 'YYYY-MM-DD HH:mm:ss')),
                        date = new Date();
                    if (+fromDate <= +date && +date <= +toDate) {
                        item.price_percent = ~~(-100 * (item.regular_price_with_tax -
                            item.final_price_with_tax) / item.regular_price_with_tax);
                        item.price_percent_class = '';
                    } else {
                        item.price_percent_class = 'none';
                        item.final_price_with_tax = item.regular_price_with_tax;
                    }
                    item.final_price_with_tax = parseFloat(item.final_price_with_tax).toFixed(2);
                    item.regular_price_with_tax = parseFloat(item.regular_price_with_tax).toFixed(2);
                    return item;
                });
                $el[func](Handlebars.compile($itemTpl.html())({
                    items: items
                }));
                $page.data('scroll').refresh();
                if (callback) {
                    callback();
                }
            },
            error: function (jqXHR) {
                alert(this.url + ':' + jqXHR.status);
            }
        });
    }

    initEvents();
    initViews();
    showMenus();
    showPages();
    initPageScroll({
        pages: pages,
        onRefresh: function (callback) {
            initItems($('.products-grid').eq(currentPage), 'html', callback);
        },
        onLoadMore: function (callback) {
            initItems($('.products-grid').eq(currentPage), 'append', callback);
        }
    });
	
    Mobilebone.callback = function (pageinto) {
        var $this = $(pageinto),
            $headerIndex = $('.header-index').addClass('out'),
            $frame = $('.frame').addClass('out');

        if ($this.hasClass('page-index')) {
            $headerIndex.removeClass('out');
            $frame.removeClass('out');
            $(sprintf('a[href="#%s"', $this.attr('id'))).addClass('bullet-item-active')
                .siblings().removeClass('bullet-item-active');
        } else if ($this.hasClass('page-detail')) {
            var m = location.hash.match(/url=(.*)/);
            if (m) {
                $this.find('iframe').attr('src', m[1]);
            }
        }
    };
    Mobilebone.jsonHandle = function (product) {
        console.log(product);
        product.regular_price_with_tax = parseFloat(product.regular_price_with_tax).toFixed(2);
        product.final_price_with_tax = parseFloat(product.final_price_with_tax).toFixed(2);
        return $(Handlebars.compile($detailTpl.html())({
            product: product
        })).html();
    };
}

if (isApp) {
    $(document).ready(ready);
} else {
    $(document).ready(ready);
}