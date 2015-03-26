function ready() {
    var currentPage = 0,
        $menuTpl = $('#menu-template'),
        $slideTpl = $('#slide-template'),
        $itemTpl = $('#item-template');

    function showMenus() {
        $('.cbp-spmenu-list').html(Handlebars.compile($menuTpl.html())({
            menus: menus
        }));

        $.each(pages, function (i, page) {
            $('.swiper-pagination').append(sprintf(
                '<span class="bullet-item %s">%s</span>',
                i === 0 ? 'bullet-item-active' : '',
                page.title));
        });
        $('.bullet-item').click(function () {
            myScroll.scrollToPage($(this).index(), 0);
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
                    item.product_detail = api.product_detail;
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

    initViews();
    showMenus();
    initPageScroll({
        pages: pages,
        onPage: function (page) {
            currentPage = page;
            $('.bullet-item').eq(page).addClass('bullet-item-active')
                .siblings().removeClass('bullet-item-active');
        },
        onRefresh: function (callback) {
            initItems($('.products-grid').eq(currentPage), 'html', callback);
        },
        onLoadMore: function (callback) {
            initItems($('.products-grid').eq(currentPage), 'append', callback);
        },
        onLeft: toggleMenu
    });
    new Swiper('#wrapper .swiper-container', {
        autoplay: 2000
    });
}

if (isApp) {
    $(function () {
        document.addEventListener("deviceready", ready, false);
    });
} else {
    $(document).ready(ready);
}