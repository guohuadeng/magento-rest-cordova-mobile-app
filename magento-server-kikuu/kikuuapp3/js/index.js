function ready() {
    var currentPage = 0, // 当前切换页面 index
        bannerSwiper,
        $pages;

    function init() {
        initEvents();
        initMenus();
    }

    // 获取菜单信息
    function initMenus() {
        servers.getMenus(function (menus) {
            showMenus(menus);
            showPages(menus);
            initPages();
            initUser();
            Mobilebone.init();
        });
    }

    // 获取用户
    function initUser() {
        servers.getUser(function (user) {
            defines.user = user;

            var $menus = $('.cbp-spmenu-list');

            if (defines.user) {
                $menus.find('.login_true').show();
                $menus.find('.login_false').hide();
            } else {
                $menus.find('.login_true').hide();
                $menus.find('.login_false').show();
            }
        });
    }

    // 用户用户状态显示菜单
    function showMenus(menus) {
        $.each(menus, function (i, item) {
            item.url = '#c' + item.category_id;
        });
        // 插入数据到 menus 中，从位置 1 开始
        defines.menus.splice.apply(defines.menus, [1, 0].concat(menus));

        $('.cbp-spmenu-list').html(Handlebars.compile(defines.menuTpl)({
            menus: defines.menus
        }));

        // 菜单项点击
        $(document).on('click', '.cbp-spmenu li a', function () {
            $(this).parent().addClass('active').siblings().removeClass('active');
            // 退出
            if ($(this).parent().hasClass('exit')) {
                navigator.app.exitApp();
            } else {
                toggleMenu();
            }
        });

        // logout
        $(document).on('click', '.logout', function () {
            servers.logout(initUser);
        });
    }

    // 根据 page 配置构造 banner 和 切换页面
    function showPages(res) {
        $.each(res, function (i, item) {
            defines.pages.push({
                id: 'c' + item.category_id,
                cmd: 'catalog&categoryid=' + item.category_id,
                title: item.name,
                pullRefresh: true,
                num: 1,
                total: 0
            });
        });
        $.each(defines.pages, function (i, page) {
            $('.swiper-container .swiper-wrapper').append(sprintf(
                '<a href="#%s" data-rel="auto" class="swiper-slide bullet-item">%s</a>',
                page.id, page.title));
        });
        bannerSwiper = new Swiper('.swiper-container', {
            slidesPerView: 3,
            centeredSlides: true,
            parallax: true
        });

        $pages = $('#pageScroller').html(Handlebars.compile(defines.slideTpl)({
            menus: defines.pages
        })).find('.products-grid');
    }

    function initPages() {
        initPageScroll({
            pages: defines.pages,
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
                    Mobilebone.transition($('#' + defines.pages[index - 1].id)[0], $('#' + id)[0], true);
                }
            },
            onRight: function (id, index) {
                if (index + 1 < defines.pages.length) {
                    Mobilebone.transition($('#' + defines.pages[index + 1].id)[0], $('#' + id)[0], false);
                }
            }
        });
    }

    // 单个产品列表处理
    function initItems($el, func, callback) {
        var page = defines.pages[$el.parents('.page').index()],
            $page = $('#' + page.id),
            items = [];

        page.num = func === 'html' ? 1 : page.num + 1;

        servers.getProducts(page, function (list) {
            if ($.isArray(list)) {
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
                $el[func](Handlebars.compile(defines.itemTpl)({
                    items: items
                }));
                var $cb = $el.find('.cb');
                $cb = $cb.length ? $cb : $('<div class="cb"></div>');
                $el.append($cb);
                $('img.lazy').slice(page.total).lazyload({
                    container: $page.find('.scroller'),
                    placeholder: 'images/loading.gif',
					threshold : 200	//离像素还有200px时加载
                });
                page.total = func === 'html' ? 0 : page.total + list.length;
            } else {
                $page.data('pullUp', $page.find('.pullUp').remove());
            }
            $page.data('scroll').refresh();
            if (callback) {
                callback();
            }
        });
    }

    // 统一处理页面跳转相关
    Mobilebone.callback = function (pageInto) {
        var $this = $(pageInto),
            $headerIndex = $('.header-index').addClass('out'),
            $frame = $('.frame').addClass('out'),
            $page;

	    // index页
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
            return;
        }

        // login页
        if ($this.hasClass('page-login')) {
            $this.find('[name="login"]').click(function () {
                var username = $this.find('[name="username"]').val(),
                    password = $this.find('[name="password"]').val();

                servers.login(username, password, function (res) {
                    if (res) {
                        history.back();
                        initUser();
                    } else {
                        alert('Username or password error!');
                    }
                });
            });
        }

	    // detail页，product-frame页处理
        if ($this.hasClass('page-detail')) {
            var query = utils.queryUrl();
            if (query.url) {
				if (query.entity_id) {
					query.url = query.url + '?entity_id=' + query.entity_id;
				}
                $this.find('iframe').attr('src', query.url);
            }
            if (query.title) {
                $this.find('.title').text(query.title);
            }
            if (query.share) {
                $this.find('.share').show();
            }
            return;
        }
    };

    // 处理 ajax json 加载，暂时没有使用到，留着详情页 rest 接口用
    Mobilebone.jsonHandle = function (product) {
        product.regular_price_with_tax = parseFloat(product.regular_price_with_tax).toFixed(2);
        product.final_price_with_tax = parseFloat(product.final_price_with_tax).toFixed(2);
        return $(Handlebars.compile(defines.detailTpl)({
            product: product
        })).html();
    };

    init();

    // 全局函数
    window.initUser = initUser;
}

$(document).ready(ready);