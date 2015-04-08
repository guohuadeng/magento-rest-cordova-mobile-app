function ready() {
    var currentPage = 0, // 当前切换页面 index
        bannerSwiper,
        $pages,
        $menuTpl = $('#menu-template'),
        $slideTpl = $('#slide-template'),
        $itemTpl = $('#item-template'),
        $detailTpl = $('#detail-template');

    // 根据 rest 接口构造菜单
    function showMenus() {
        $.getJSON(api.menus, function (res) {
            var menus = [
                {
                    name: 'Home',
                    class_name: 'active'
                }
            ];
            $.each(res, function (i, item) {
                item.url = '#c' + item.category_id;
            });
            menus = menus.concat(res);
            menus.push({
                name: '',
                class_name: 'table-view-divider',
                url: '#'
            }, {
                name: 'My Order',
                url: 'detail.html?title=My Order&url=' + baseUrl + '/sales/order/history/?fromui=app'
            }, {
                name: 'My Shopping Cart',
                url: 'detail.html?title=My Shopping Cart&url=' + baseUrl + '/checkout/cart/?fromui=app'
            }, {
                name: 'Account and Setting',
                url: 'detail.html?title=Account and Setting&url=' + baseUrl + '/customer/account/?fromui=app'
            }, {
                name: 'Exit',
                class_name: 'exit',
                url: '#'
            });
            $('.cbp-spmenu-list').html(Handlebars.compile($menuTpl.html())({
                menus: menus
            }));
        });
    }

    // 根据 page 配置构造 banner 和 切换页面
    function showPages() {
        $.each(pages, function (i, page) {
            $('.swiper-container .swiper-wrapper').append(sprintf(
                '<a href="#%s" data-rel="auto" class="swiper-slide bullet-item">%s</a>',
                page.id, page.title));
        });
        bannerSwiper = new Swiper('.swiper-container', {
            slidesPerView: 3,
            centeredSlides: true,
            parallax: true
        });

        $pages = $('#pageScroller').html(Handlebars.compile($slideTpl.html())({
            menus: pages
        })).find('.products-grid');
    }

    // 单个产品列表处理
    function initItems($el, func, callback) {
        var page = pages[$el.parents('.page').index()],
            $page = $('#' + page.id),
            items = [];

        page.num = func === 'html' ? 1 : page.num + 1;

        $.ajax({
            type: 'get',
            url: sprintf(api.products, page.cmd, page.num === 1 ? 10 : 4, page.num),
            contentType: 'application/json',
            dataType: 'json',
            success: function (list) {
                // 处理返回数据
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
                alert('Please check the network!');
                navigator.app.exitApp();
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
        },
        onLeft: function (id, index) {
            if (index === 0) {
                toggleMenu();
            } else {
                Mobilebone.transition($('#' + pages[index - 1].id)[0], $('#' + id)[0], true);
            }
        },
        onRight: function (id, index) {
            if (index + 1 < pages.length) {
                Mobilebone.transition($('#' + pages[index + 1].id)[0], $('#' + id)[0], false);
            }
        }
    });

    // 统一处理页面跳转相关
    Mobilebone.callback = function (pageinto) {
        var $this = $(pageinto),
            $headerIndex = $('.header-index').addClass('out'),
            $frame = $('.frame').addClass('out'),
            $page;

        if ($this.hasClass('page-index')) {
            currentPage = $this.index();
            bannerSwiper.slideTo(currentPage);
            $headerIndex.removeClass('out');
            $frame.removeClass('out');
            $(sprintf('a[href="#%s"', $this.attr('id'))).addClass('bullet-item-active')
                .siblings().removeClass('bullet-item-active');

            $page = $pages.eq(currentPage);
            if (!$page.data('init')) {
                $('.page-loading').show();
                initItems($page, 'html', function () {
                    $('.page-loading').hide();
                });
                $page.data('init', true);
            }
            $this.data('scroll').refresh(); // 刷新 scroll
        } else if ($this.hasClass('page-detail')) {
            var query = {};
            $.each(location.hash.substring(location.hash.indexOf('?') + 1).split('&'), function (i, item) {
                var items = item.split('=');
                query[items[0]] = items[1];
            });
            if (query.url) {
                $this.find('iframe').attr('src', query.url);
            }
            if (query.title) {
                $this.find('.title').text(query.title);
            }
        }
    };

    // 处理 ajax json 加载，暂时没有使用到，留着详情页 rest 接口用
    Mobilebone.jsonHandle = function (product) {
        product.regular_price_with_tax = parseFloat(product.regular_price_with_tax).toFixed(2);
        product.final_price_with_tax = parseFloat(product.final_price_with_tax).toFixed(2);
        return $(Handlebars.compile($detailTpl.html())({
            product: product
        })).html();
    };
}

if (isApp) {
    $(document).ready(ready);
//    document.addEventListener('deviceready', ready, false);
} else {
    $(document).ready(ready);
}
