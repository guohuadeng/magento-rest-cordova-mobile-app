/**
 * Server 类，对 rest 接口进行封装
 * 使用例如：
 * servers.getUser(function () {
 *
 * });
 */

(function (window) {

    var url = {
        user: defines.baseUrl + '/restconnect/customer/status',
        login: defines.baseUrl + '/restconnect/customer/login',
        logout: defines.baseUrl + '/customer/account/logout',
        menus: defines.baseUrl + '/restconnect/?cmd=menu',
        products: defines.baseUrl + '/restconnect/?cmd=%s&limit=%s&page=%s',
        products_search: defines.baseUrl + '/restconnect/search/?q=%s',
        products_detail: defines.baseUrl + '/catalog/product/view/id/%s', //这个是直接详情页面
        product_rest: defines.baseSite + '/api/rest/products/%s',
        //product_rest: defines.baseUrl + '/restconnect/products/getproductdetail/productid/%s',
        product_img: defines.baseSite + '/api/rest/products/%s/images/',
        product_attr: defines.baseUrl + '/restconnect/products/getcustomeattr/productid/%s', //开发中
        product_option: defines.baseUrl + '/restconnect/products/getcustomoption/productid/%s'
    };

    window.servers = {};

    servers.getUser = function (callback) {
        $.getJSON(url.user).done(callback).fail(error);
    };

    servers.login = function (username, password, callback) {
        $.getJSON(url.login, {
            username: username,
            password: password
        }, callback).fail(function () {
            alert('Username or password is error!');
        });
    };

    servers.logout = function (callback) {
        $.get(url.logout, callback).fail(error);
    };

    servers.getMenus = function (callback) {
        $.getJSON(url.menus, callback).fail(error);
    };

    servers.getProducts = function (page, callback) {
        $.ajax({
            type: 'get',
            url: sprintf(url.products, page.cmd, defines.productsLimit, page.num),
            contentType: 'application/json',
            dataType: 'json',
            success: callback,
            error: error
        });
    };

    servers.getProductsSearch = function (q, callback) {
        $.ajax({
            type: 'get',
            url: sprintf(url.products_search, q),
            contentType: 'application/json',
            dataType: 'json',
            success: callback,
            error: error
        });
    };

    servers.getProductsDetail = function (id, callback) {
        $.ajax({
            type: 'get',
            url: sprintf(url.products_detail, id),
            contentType: 'application/json',
            dataType: 'json',
            success: callback,
            error: error
        });
    };

    servers.getProductsRest = function (id, callback) {
        $.ajax({
            type: 'get',
            url: sprintf(url.products_rest, id),
            contentType: 'application/json',
            dataType: 'json',
            success: callback,
            error: error
        });
    };

    servers.getProductsImg = function (id, callback) {
        $.ajax({
            type: 'get',
            url: sprintf(url.products_img, id),
            contentType: 'application/json',
            dataType: 'json',
            success: callback,
            error: error
        });
    };

    servers.getProductsAttr = function (id, callback) {
        $.ajax({
            type: 'get',
            url: sprintf(url.products_attr, id),
            contentType: 'application/json',
            dataType: 'json',
            success: callback,
            error: error
        });
    };

    servers.getProductsOption = function (id, callback) {
        $.ajax({
            type: 'get',
            url: sprintf(url.products_option, id),
            contentType: 'application/json',
            dataType: 'json',
            success: callback,
            error: error
        });
    };

    // 统一处理 API 请求错误
    function error(err) {
        console.log(err);
    }
})(window);