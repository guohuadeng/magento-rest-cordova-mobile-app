function Service($rootScope, Config) {

    var api = {
        user: Config.baseUrl + '/restconnect/customer/status',
        menus: Config.baseUrl + '/restconnect/?cmd=menu',
        products: Config.baseUrl + '/restconnect/',
        login: Config.baseUrl + '/restconnect/customer/login',
        logout: Config.baseUrl + '/customer/account/logout',
        search: Config.baseUrl + '/restconnect/search',
        product_detail: Config.baseUrl + '/restconnect/products/getproductdetail/productid/76'
        /*
        product_detail: defines.baseWeb + '/catalog/product/view/id/%s', //这个是直接详情页面
        product_rest: defines.baseApi + '/restconnect/products/getproductdetail/productid/%s',
        product_img: defines.baseSite + '/api/rest/products/%s/images/',
        product_attr: defines.baseApi + '/restconnect/products/getcustomeattr/productid/%s', //开发中
        product_option: defines.baseApi + '/restconnect/products/getcustomoption/productid/%s',
        cart_add: defines.baseApi + '/restconnect/cart/add/',	//直接post到这个接口就返回参数
        cart_get_qty: defines.baseApi + '/restconnect/cart/getQty'	//直接post到这个接口就返回参数
        */
    };

    $rootScope.service = {
        get: function (key, params, callback) {
            if (typeof params === 'function') {
                callback = params;
                params = null;
            }

            var url = api[key];

            $.get(url, params, function (res) {
                if (typeof callback === 'function') {
                    try {
                        callback($.parseJSON(res));
                    } catch (e) {
                        callback();
                    }
                }
            });
        }
    }
}
