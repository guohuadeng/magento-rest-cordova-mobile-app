/**
 * Define 类，对全局变量和常量进行定义
 * 使用例如：
 * defines.
 */

(function (window) {

    var baseSite = 'http://www.kikuu.com',
		baseLang = 'en',
		appView = 'm',
		baseUrl = baseSite + '/' +baseLang,	//这个即将废除，用baseApi来
		baseApi = baseSite + '/' +baseLang,	//这是默认Api地址
		baseWeb = baseSite + '/' +appView,
		cur_entity_id;	//当前查看产品id，可能没用，留着
	
    window.defines = {
		baseSite: baseSite,
		baseLang: baseLang,
        baseUrl: baseUrl,
        baseApi: baseApi,
		baseWeb: baseWeb,
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
            url: 'detail.html?title=My Order&frameUrl=' + baseWeb + '/sales/order/history/',
            class_name: 'login_true'
        }, {
            name: 'My Shopping Cart',
            url: 'detail.html?title=My Shopping Cart&frameUrl=' + baseWeb + '/checkout/cart/',
            class_name: 'login_true'
        }, {
            name: 'My Account',
            url: 'detail.html?title=My Account&frameUrl=' + baseWeb + '/customer/account',
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
			title: 'New Arrival',	//使用新品new arrival
            pullRefresh: true,
            num: 1,
            total: 0
        }
		/* 换成new，而coming soon 因接口问题，停用
			{
            id: 'bestSeller',
            cmd: 'best_seller',
            title: 'Best Seller'
            pullRefresh: true,
            num: 1,
            total: 0
        }
		, {
            id: 'comingSoon',
            cmd: 'coming_soon',
            title: 'Coming Soon',
            pullRefresh: true,
            num: 1,
            total: 0
        }*/
		]
    };
	//此次定义为动态价格实现，先不处理
	window.opConfig = {};
	opConfig.reloadPrice = function ()	{
		};
		
})(window);