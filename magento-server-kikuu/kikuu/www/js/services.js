angular.module('app.services', ['ngResource'])

    .factory('MenuService', function ($resource, Config) {
        return $resource(Config.baseUrl + '/restconnect/?cmd=menu');
    })

    .factory('UserService', function ($resource, Config) {
        return $resource(Config.baseUrl + '/restconnect/customer/status');
    })

    .factory('LoginService', function ($resource, Config) {
        return $resource(Config.baseUrl + '/restconnect/customer/login');
    })

    .factory('LogoutService', function ($resource, Config) {
        return $resource(Config.baseUrl + '/customer/account/logout');
    })

    .factory('ProductsService', function ($resource, Config) {
        return $resource(Config.baseUrl + '/restconnect/');
    });