/**
 * Define 类，对全局变量和常量进行定义
 * 使用例如：
 * defines.
 */

(function (window) {

    var baseUrl = 'http://www.kikuu.com',
		cur_entity_id;	//当前查看产品id，可能没用，留着

    window.defines = {
        baseUrl: baseUrl,
        cur_entity_id: cur_entity_id,
        user: null,
        state: 'index',
        productsLimit: 50, // 产品页每次请求时取的商品
		
        menus: [{
            name: 'Home',
            class_name: 'active'
        }, {
            name: '',
            class_name: 'table-view-divider',
            url: '#'
        }, {
            name: 'My Order',
            url: 'detail.html?title=My Order&frameUrl=' + baseUrl + '/sales/order/history/',
            class_name: 'login_true'
        }, {
            name: 'My Shopping Cart',
            url: 'detail.html?title=My Shopping Cart&frameUrl=' + baseUrl + '/checkout/cart/',
            class_name: 'login_true'
        }, {
            name: 'My Account',
            url: 'detail.html?title=My Account&frameUrl=' + baseUrl + '/customer/account',
            class_name: 'login_true'
        }, {
            name: 'Logout',
            url: '#',
            class_name: 'login_true logout'
        }, {
            name: 'Exit',
            class_name: 'exit',
            url: '#'
        }],
        pages: [{
            id: 'dailySale',
            cmd: 'daily_sale',
            title: 'Daily Sale',
            pullRefresh: true,
            num: 1,
            total: 0
        }, {
            id: 'bestSeller',
            cmd: 'best_seller',
            title: 'Best Seller',
            pullRefresh: true,
            num: 1,
            total: 0
        }, {
            id: 'comingSoon',
            cmd: 'coming_soon',
            title: 'Coming Soon',
            pullRefresh: true,
            num: 1,
            total: 0
        }]
    };
})(window);