function Service($rootScope) {

    var base = 'http://demo.sunpop.cn/en',
        api = {
            menus: base + '/restconnect/?cmd=menu',
            products: base + '/restconnect/'
        };

    $rootScope.service = {
        get: function ($scope, key, params, callback) {
            if (typeof params === 'function') {
                callback = params;
                params = null;
            }

            var url = api[key];

            $.get(url, params, function (res) {
                $scope[key] = $.parseJSON(res);
                if (typeof callback === 'function') {
                    callback($scope[key]);
                }
            });
        }
    }
}