/**
 * Created with JetBrains WebStorm.
 * User: zijun.xuzj
 * Date: 12-12-21
 * Time: 上午9:21
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module) {
    var $ = require('$');
    var getScript = function(url, fnback, simple) {
        var s, c, fn = 'jsonp' + (+new Date()) + ($.jsonpid = ++$.jsonpid || 0), d = document, src = (url.indexOf("?") == "-1" ? url + "?" : url) + (simple ? '' : '&call=' + fn);
        (s = d.createElement("script")).setAttribute("type", "text/javascript");
        d.getElementsByTagName("head")[0].appendChild(s).src = src;
        window[fn] = function() {
            if(typeof fnback!=='undefined'){
                fnback.apply(null, arguments);
            }
            c = 1;
        };
        function done(){
            s.parentNode.removeChild(s);
            if(c || fnback){
                fnback();
            }
        }
        s.onload = s.onreadystatechange = function(){
            if(s.readyState){
                if(s.readyState.toLowerCase() == 'loaded'){
                    done();
                }
            }else{
                done();
            }
            //s.readyState ? s.readyState.toLowerCase() == 'loaded' && done() : done();
        };
    };

    module.exports = getScript;
});