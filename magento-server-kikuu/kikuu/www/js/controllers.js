angular.module('app.controllers', [])

    .controller('AppCtrl', function ($scope, $rootScope, $ionicModal, Config) {
        // 用户信息
        $rootScope.service.get('user', function (user) {
            $scope.user = user;
            if ($scope.user) {
                $scope.user.src = Config.baseUrl +
                    '/media/customer' + $scope.user.avatar;
            }
        });
        // 菜单处理
        $rootScope.service.get('menus', function (menus) {
            $scope.menus = [{
                cmd: 'daily_sale',
                name: 'Daily Sale',
                class_name: 'one-line'
            }, {
                cmd: 'best_seller',
                name: 'New Arrival',
                class_name: 'one-line'
            }].concat(menus);
            $scope.$broadcast('menusData', $scope.menus);
        });
        $scope.setCatalog = function (index) {
            $scope.$broadcast('setCatalog', index);
        };

        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {

        };

        $scope.exit = function () {
            if (confirm('Are you sure to exit the Kikuu app?')) {
                navigator.app.exitApp();
            }
        };
    })

    .controller('ListsCtrl', function ($scope, $rootScope, $ionicSlideBoxDelegate) {
        var getList = function (slide, type, callback) {
            if (type === 'load') {
                slide.page++;
            } else {
                slide.page = 1;
            }

            var params = {
                limit: 10,
                page: slide.page,
                cmd: slide.cmd || 'catalog'
            };
            if (slide.category_id) {
                params.categoryid = +slide.category_id;
            }
            $rootScope.service.get('products', params, function (lists) {
                if (type === 'load') {
                    if (lists) {
                        slide.lists = slide.lists.concat(lists);
                    } else {
                        slide.loadOver = true;
                    }
                } else {
                    slide.lists = lists;
                }
                slide.hasInit = true;
                $scope.$apply();
                if (typeof callback === 'function') {
                    callback();
                }
            });
        };

        $scope.update = function () {
            $ionicSlideBoxDelegate.update();
            setTimeout(function () {
                $ionicSlideBoxDelegate.slide(0);
            }, 10);
        };
        $scope.$on('ngRepeatFinished', function () {
            $scope.update();
        });

        // 根据菜单生成 slides
        $scope.$on('menusData', function (e, menus) {
            $scope.menus = menus;
            $scope.slides = menus.slice(0);
            $scope.$apply();
        });
        $scope.$on('setCatalog', function (e, index) {
            $ionicSlideBoxDelegate.slide(index);
        });
        $scope.onSlideMove = function (data) {
            if (isNaN(data.index)) {
                return;
            }
            var slide = $scope.slides[data.index];

            if (slide.hasInit) {
                return;
            }
            getList(slide, 'refresh');
        };

        $scope.doRefresh = function (index) {
            getList($scope.slides[index], 'refresh', function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
        };
        $scope.loadMore = function (index) {
            getList($scope.slides[index], 'load', function () {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        };
    })
		//产品统一用这个名 Product
    .controller('ProductCtrl', function ($scope, $stateParams) {

    })
		//产品选项
    .controller('ProductOptionCtrl', function ($scope, $stateParams) {

    })
		
    .controller('DetailCtrl', function ($scope, $stateParams) {

    })

    .controller('SearchCtrl', function ($scope, $location) {
        $scope.model = {};
        $scope.onSearch = function () {
            $location.path('app/search/' + $scope.model.text);
        };
    })

    .controller('SearchResultCtrl', function ($scope, $rootScope, $stateParams) {
        $scope.text = $stateParams.text;
        $rootScope.service.get('search', {q: $stateParams.text}, function (results) {
            $scope.results = results;
            $scope.$apply();
        });
    })

    .controller('FrameCtrl', function ($scope, $sce, $stateParams, Config) {
        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        };

        var frame = Config.frames[$stateParams.page];
        $scope.title = frame.title;
        $scope.src = frame.src;
    });
