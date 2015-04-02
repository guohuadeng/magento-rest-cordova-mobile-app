function ready() {
    var currentPage = 0,
        bannerSwiper,
        $menuTpl = $('#menu-template'),
        $slideTpl = $('#slide-template'),
        $itemTpl = $('#item-template'),
        $detailTpl = $('#detail-template');

    function showMenus() {
		
		//var myCartUrl = 'detail.html?title=My Shopping Cart&url=' + baseUrl + '/checkout/cart/?fromui=app';
        //$("cartIcon").attr("href",myCartUrl);
		//document.getElementById("cartIcon").setAttribute ("href", myCartUrl);
		
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
                url: 'detail.html?title=My Order&url=' + baseUrl + '/sales/order/history/?fromui=app'
            }, {
                name: 'My Shopping Cart',
                url: 'detail.html?title=My Shopping Cart&url=' + baseUrl + '/checkout/cart/?fromui=app'
            }, {
                name: 'My Wish List',
                url: 'detail.html?title=My Wish List&url=' + baseUrl + '/wishlist/?fromui=app'
            }, {
                name: 'Account and Setting',
                url: 'detail.html?title=Account and Setting&url=' + baseUrl + '/customer/account/?fromui=app'
            }, {
                name: 'Exit',
                url: '#'
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
        bannerSwiper = new Swiper('.swiper-container', {
            slidesPerView : 3,
			centeredSlides : true,
			parallax: true
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
            })).find('.products-grid').each(function (i) {
                initItems($(this), 'html', function () {
                    if (i === 0) {
                        $('.first-start.loading').remove();
                        if (!location.hash) {
                            $('#dailySale').click();
                        }
                    }
                });
            });
    }

    function initItems($el, func, callback) {
        var page = pages[$el.parents('.page').index()],
            $page = $('#' + page.id),
            items = [];

        page.num = func === 'html' ? 1 : page.num + 1;

        $.ajax({
            type: 'get',
            url: sprintf(api.products, page.cmd, page.num === 1 ? 10 : 3, page.num),
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

    Mobilebone.callback = function (pageinto) {
        var $this = $(pageinto),
            $headerIndex = $('.header-index').addClass('out'),
            $frame = $('.frame').addClass('out');

        if ($this.hasClass('page-index')) {
            currentPage = $this.index();
            bannerSwiper.slideTo(currentPage);
            $headerIndex.removeClass('out');
            $frame.removeClass('out');
            $(sprintf('a[href="#%s"', $this.attr('id'))).addClass('bullet-item-active')
                .siblings().removeClass('bullet-item-active');
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