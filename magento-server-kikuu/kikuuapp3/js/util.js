/**
 * Util 类，工具
 * 使用例如：
 * utils.queryUrl();
 */

(function (window) {
    window.utils = {
        queryUrl: function (key) {
            var query = {};
            $.each(location.hash.substring(location.hash.indexOf('?') + 1).split('&'), function (i, item) {
                var items = item.split('=');
                query[items[0]] = items[1];
            });
            if (key) {
                return query[key];
            }
            return query;
        }
    };
})(window);
