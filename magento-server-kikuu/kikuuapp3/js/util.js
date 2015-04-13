/**
 * Util 类，工具
 * 使用例如：
 * utils.
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

function requestUrl(paras)
    { 
        var url = location.href; 
        var paraString = url.substring(url.indexOf('?')+1,url.length).split('&'); 
        var paraObj = {} 
        for (i=0; j=paraString[i]; i++){ 
        paraObj[j.substring(0,j.indexOf('=')).toLowerCase()] = j.substring(j.indexOf('=')+1,j.length); 
        } 
        var returnValue = paraObj[paras.toLowerCase()]; 
        if(typeof(returnValue)=='undefined'){ 
        return ''; 
        }else{ 
        return returnValue; 
        } 
    }