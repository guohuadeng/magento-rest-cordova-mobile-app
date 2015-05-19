var isRelease = 0; //改环境图省事，设置为0则为开发环境，1为生产

var baseUrl = 'http://www.kikuu.com/en',
    baseSite = 'http://www.kikuu.com/m';

if (isRelease == 0 )	{
	baseUrl = 'http://demo.sunpop.cn/en';
    baseSite = 'http://demo.sunpop.cn/m';
}
if (isRelease == -1 )	{
	baseUrl = 'http://lvee.sunpop.cn/en';
    baseSite = 'http://lvee.sunpop.cn/m';
}

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
            account: {
                title: 'My Reward',
                src: 'http://demo-extension.magestore.com/sandbox/reward-points/platinum/index.php/autologin/demo'
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