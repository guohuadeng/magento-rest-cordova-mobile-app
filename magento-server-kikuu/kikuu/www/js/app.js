// Ionic Starter App
// 'app' is the name of this angular module (also set in a <body> attribute in index.html)
angular.module('app', ['ionic', 'app.config', 'app.services', 'app.controllers'])

    .run(function ($ionicPlatform) {
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
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl'
            })

            .state('app.search', {
                url: '/search',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/search.html'
                    }
                }
            })

            .state('app.lists', {
                url: '/lists/:id/:title',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/lists.html',
                        controller: 'ListsCtrl'
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
        $urlRouterProvider.otherwise('/app/lists/daily_sale/Daily%20Sale');
    });
