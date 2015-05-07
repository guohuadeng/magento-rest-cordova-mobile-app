// Ionic Starter App
// 'app' is the name of this angular module (also set in a <body> attribute in index.html)
angular.module('app', [
        'ionic', 'tabSlideBox',
        'app.config', 'app.controllers',
        'app.filters'
    ])

    .run(function ($ionicPlatform, $rootScope, Config) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
        Service($rootScope, Config);
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl'
            })
            .state('app.login', {
                url: '/login',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/login.html'
                    }
                }
            })
            .state('app.lists', {
                url: '/lists',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/lists.html',
                        controller: 'ListsCtrl'
                    }
                }
            })
            .state('app.productDetail', {
                url: '/productDetail/:productid',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/productDetail.html',
                        controller: 'productDetailCtrl'
                    }
                }
            })
            .state('app.productOption', { //这个是要以model显示的，临时这么处理看效果先
                url: '/productOption/:productid',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/productOption.html',
                        controller: 'ProductOptionCtrl'
                    }
                }
            })
            .state('app.detail', {
                url: '/detail/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/detail.html',
                        controller: 'DetailCtrl'
                    }
                }
            })
						/*
            .state('app.register', {
                url: '/register',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/register.html'
                    }
                }
            }) */
            .state('app.search', {
                url: '/search',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/search.html',
                        controller: 'SearchCtrl'
                    }
                }
            })
            .state('app.searchResult', {
                url: '/search/:text',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/searchResult.html',
                        controller: 'SearchResultCtrl'
                    }
                }
            })
            .state('app.cart', {
                url: '/cart',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/cart.html'
                    }
                }
            })
            .state('app.frame', {
                url: '/frame/:page',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/frame.html',
                        controller: 'FrameCtrl'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/lists');
    })

    .directive('onFinishRender', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit('ngRepeatFinished');
                    });
                }
            }
        }				
				
    });
