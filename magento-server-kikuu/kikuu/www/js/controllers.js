angular.module('app.controllers', [])

    .controller('AppCtrl', function ($scope, $rootScope, $ionicModal) {
        $rootScope.service.get($scope, 'menus');

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
        $scope.parseInt = parseInt;
        $scope.update = function () {
            $ionicSlideBoxDelegate.update();
        };
        $scope.$on('ngRepeatFinished', function () {
            $scope.update();
        });

        $rootScope.service.get($scope, 'menus', function () {
            $scope.slides = $scope.menus.slice(0);
            $scope.$apply();
        });

        $scope.onSlideMove = function (data) {
            var slide = $scope.slides[data.index];

            if (slide.hasInit) {
                return;
            }

            var params = {
                limit: 50,
                page: 1,
                cmd: 'catalog',
                categoryid: +slide.category_id
            };
            $rootScope.service.get($scope, 'products', params, function (lists) {
                slide.lists = lists;
                slide.hasInit = true;
                $scope.$apply();
            });
        };
    })

    .controller('DetailCtrl', function ($scope, $stateParams) {

    })

    .controller('FrameCtrl', function ($scope, $sce, $stateParams, Config) {
        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        };

        var frame = Config.frames[$stateParams.page];
        $scope.title = frame.title;
        $scope.src = frame.src;
    });
