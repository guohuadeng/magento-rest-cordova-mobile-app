var baseUrl = 'http://www.kikuu.com/en',
    baseSite = 'http://www.kikuu.com/m';

angular.module('app.config', [])
    .constant('Config', {
        baseUrl: baseUrl,
        baseSite: baseSite,
        frames: {
            personal: {
                title: 'Persional Infomation',
                src: baseSite + '/customer/account/edit'
            },
            account: {
                title: 'My Account',
                src: baseSite + '/customer/account'
            },
            order: {
                title: 'My Orders',
                src: baseSite + '/sales/order/history/'
            },
            address: {
                title: 'My Address Book',
                src: baseSite + '/customer/address'
            },
            wishlist: {
                title: 'My Wishlist',
                src: baseSite + '/wishlist'
            },
            cart: {
                title: 'My Shopping Cart',
                src: baseSite + '/checkout/cart/'
            }
        }
    });