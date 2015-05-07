var baseUrl = 'http://demo.sunpop.cn/en',
    baseSite = 'http://demo.sunpop.cn/m';

angular.module('app.config', [])
    .constant('Config', {
        baseUrl: baseUrl,
        baseSite: baseSite,
        frames: {
            account: {
                title: 'My Account',
                src: baseSite + '/customer/account'
            },
            order: {
                title: 'My Orders',
                src: baseSite + '/sales/order/history/'
            },
            cart: {
                title: 'My Shopping Cart',
                src: baseSite + '/checkout/cart/'
            }
        }
    });