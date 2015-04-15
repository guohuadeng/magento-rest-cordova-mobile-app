function ready() {
    var currentPage = 0, // 当前切换页面 index
        bannerSwiper,
        $pages,
        menuTpl = $('#menu-template').html(),
        slideTpl = $('#slide-template').html(),
        itemTpl = $('#item-template').html();

    function init() {
        checkFirstTime();
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

            var $menus = $('.cbp-spmenu');

            if (defines.user) {
                $menus.find('.login_true').show();
                $menus.find('.login_false').hide();
                $menus.find('.userinfo img').attr('src', defines.baseUrl +
                    '/media/customer' + defines.user.avatar);
                $menus.find('.userinfo span').text(defines.user.name);
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

        $('.cbp-spmenu-list').html(Handlebars.compile(menuTpl)({
            menus: defines.menus
        }));

        // 菜单项点击
        $(document).on('click', '.cbp-spmenu a', function () {
            $(this).parent().addClass('active').siblings().removeClass('active');
            // 退出
            if ($(this).parent().hasClass('exit')) {
                if (confirm('Are you sure to exit the Kikuu app?')) {
                    navigator.app.exitApp();
                }
            } else {
                toggleMenu();
                $('.menu-bottom').hide();
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

        $pages = $('#pageScroller').html(Handlebars.compile(slideTpl)({
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
                handleItems($el, func, list);
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

    function handleItems($el, func, list) {
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
        $el[func](Handlebars.compile(itemTpl)({
            items: items
        }));
        var $cb = $el.find('.cb');
        $cb = $cb.length ? $cb : $('<div class="cb"></div>');
        $el.append($cb);
    }

    // 统一处理页面跳转相关
    Mobilebone.callback = function (pageInto) {
        var $this = $(pageInto),
            $headerIndex = $('.header-index').addClass('out'),
            $frame = $('.frame').addClass('out'),
            $page,
            query = utils.queryUrl();

        defines.state = $this.attr('class').match(/page-(\w+)/)[1];

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
            $this.find('[name="login"]').off('click').click(function () {
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
            if (query.frameUrl) {
				if (query.entity_id) {
					query.frameUrl = query.frameUrl + '?entity_id=' + query.entity_id;
				}
                $this.find('iframe').attr('src', query.frameUrl);
            }
            if (query.title) {
                $this.find('.title').text(query.title);
            }
            if (query.share) {
                $this.find('.share').show();
            }
            return;
        }

        // search
        if ($this.hasClass('page-search')) {
            $this.find('[name="q"]').off('keyup').keyup(function () {
                $this.find('[name="search"]').attr('href', 'searchResult.html?q=' + $(this).val());
            });
            return;
        }

        // search result
        if ($this.hasClass('page-search-result')) {
            servers.getProductsSearch(query.q, function (list) {
                handleItems($this.find('.products-grid'), 'html', list);
                $('img.lazy').lazyload({
                    container: $this.find('.content'),
                    placeholder: 'images/loading.gif',
                    threshold : 200	//离像素还有200px时加载
                });
            });
        }
        return;
    };

    init();

    // 全局函数
    window.initUser = initUser;
}

$(document).ready(ready);