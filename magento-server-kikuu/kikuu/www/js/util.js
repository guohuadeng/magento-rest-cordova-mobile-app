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

//将金额转化为千位带,的，尾数四舍五入，如使用 fmoney(12345.00,0)，则返回12,345
function fmoney(s, n)   
{   
   n = n > 0 && n <= 20 ? n : 2;   
   s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";   
   var l = s.split(".")[0].split("").reverse(),   
   r = s.split(".")[1];   
   t = "";   
   for(i = 0; i < l.length; i ++ )   
   {   
      t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");   
   }   
   return t.split("").reverse().join("") + "." + r; 
} 
//金额还原函数

function rmoney(s)   
{   
   return parseFloat(s.replace(/[^\d\.-]/g, ""));   
} 

