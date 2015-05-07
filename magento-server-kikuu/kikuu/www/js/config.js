angular.module('app.config', [])
    .constant('Config', {
        baseUrl: 'http://demo.sunpop.cn/en',
        baseSite: 'http://demo.sunpop.cn/m',
        frames: {
            account: {
                title: 'My Account',
                src: 'http://demo.sunpop.cn/m/customer/account'
            },
            order: {
                title: 'My Orders',
                src: 'http://demo.sunpop.cn/m/sales/order/history/'
            }
        }
    });