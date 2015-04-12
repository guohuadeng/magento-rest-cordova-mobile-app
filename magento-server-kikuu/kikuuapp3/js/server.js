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
//            product_detail: baseUrl + '/api/rest/products/'
            products_rest: defines.baseUrl + '/api/rest/products/',
            product_detail: defines.baseUrl + '/catalog/product/view/id/'
        };

    window.servers = {};

    servers.getUser = function (callback) {
        $.getJSON(url.user).done(callback).fail(error);
    };

    servers.login = function (username, password, callback) {
        $.getJSON(url.login, {
            username: username,
            password: password
        }, callback).fail(error);
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

    // 统一处理 API 请求错误
    function error(err) {
        console.log(err);
    }
})(window);