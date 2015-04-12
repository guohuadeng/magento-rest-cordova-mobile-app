define(function(require, exports, module) {
    var cookie = require('cookie');
    var $ = require('$');
    var ckInfo = {};

    var isLoginCookie = cookie.get('xman_us_t');
    var userCookie = cookie.get('xman_us_f');
    var userReg = /x_user=([^&"]+)/;

    if(isLoginCookie && isLoginCookie.indexOf('sign=y') !== -1) {
        ckInfo.isLoggedIn = true
    };

    if(userCookie && userReg.test(userCookie)) {
        userCookie.match(userReg);
        userCookie = RegExp.$1;
        userCookie = userCookie.split('|');

        if(userCookie.length >= 5) {
            ckInfo.country = userCookie[0];
            ckInfo.firstName = userCookie[1].replace(/</g, "&lt;").replace(/>/g, "&gt;");
            ckInfo.lastName = userCookie[2].replace(/</g, "&lt;").replace(/>/g, "&gt;");
            ckInfo.serviceType = userCookie[3];
            ckInfo.memberSeq = userCookie[4];
        }
    }

    if(cookie.get('ali_intl_firstIn') == '') {
        ckInfo.isFirstIn = true;
    }


    module.exports = ckInfo;
});
