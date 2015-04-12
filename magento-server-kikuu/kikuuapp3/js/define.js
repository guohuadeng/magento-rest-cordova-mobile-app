/**
 * Define 类，对全局变量和常量进行定义
 * 使用例如：
 * defines.
 */

(function (window) {

    var baseUrl = 'http://skymazon.sunpop.cn';

    window.defines = {
        baseUrl: baseUrl,
        user: null,
        state: 'index',
        productsLimit: 20, // 产品页每次请求时取的商品数量;
        menuTpl: $('#menu-template').html(),
        slideTpl: $('#slide-template').html(),
        itemTpl: $('#item-template').html(),
        detailTpl: $('#detail-template').html(),
        menus: [{
            name: 'Home',
            class_name: 'active'
        }, {
            name: '',
            class_name: 'table-view-divider',
            url: '#'
        }, {
            name: 'My Order',
            url: 'detail.html?title=My Order&url=' + baseUrl + '/sales/order/history/?fromui=app',
            class_name: 'login_true'
        }, {
            name: 'My Shopping Cart',
            url: 'detail.html?title=My Shopping Cart&url=' + baseUrl + '/checkout/cart/?fromui=app',
            class_name: 'login_true'
        }, {
            name: 'My Account',
            url: 'detail.html?title=My Account&url=' + baseUrl + '/customer/account?fromui=app',
            class_name: 'login_true'
        }, {
            name: 'Logout',
            url: '#',
            class_name: 'login_true logout'
        }, {
            name: 'Login',
            url: 'login.html',
            class_name: 'login_false'
        }, {
            name: 'Register',
            url: 'detail.html?title=Register&url=' + baseUrl + '/kikuuapp3/register.html?fromui=app',
            class_name: 'login_false'
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