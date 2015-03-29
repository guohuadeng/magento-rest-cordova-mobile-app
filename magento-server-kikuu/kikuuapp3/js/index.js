function ready() {
    var currentPage = 0,
        $menuTpl = $('#menu-template'),
        $slideTpl = $('#slide-template'),
        $itemTpl = $('#item-template'),
        $detailTpl = $('#detail-template');

    function showMenus() {
        $('.cbp-spmenu-list').html(Handlebars.compile($menuTpl.html())({
            menus: menus
        }));

        $.each(pages, function (i, page) {
            $('.swiper-pagination').append(sprintf(
                '<a href="#%s" data-rel="auto" class="bullet-item">%s</a>',
                page.id, page.title));
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
            url: sprintf(api.products, page.category_id, page.num),
            contentType: 'application/json',
            success: function (list) {
                var items = $.map(list, function (item) {
                    item.url = api.product_detail + item.entity_id;
                    item.price_percent = ~~(-100 * (item.regular_price_with_tax -
                        item.final_price_with_tax) / item.regular_price_with_tax);
                    item.final_price_with_tax = parseFloat(item.final_price_with_tax).toFixed(2);
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
    initPageScroll({
        pages: pages,
        onRefresh: function (callback) {
            initItems($('.products-grid').eq(currentPage), 'html', callback);
        },
        onLoadMore: function (callback) {
            initItems($('.products-grid').eq(currentPage), 'append', callback);
        }
    });
    new Swiper('#wrapper .swiper-container', {
        autoplay: 2000
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
            var m = location.hash.match(/id=(\d+)/);
            if (m) {
                $this.find('iframe').attr('src', api.product_detail + m[1]);
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
    $(function () {
        document.addEventListener("deviceready", ready, false);
    });
} else {
    $(document).ready(ready);
}