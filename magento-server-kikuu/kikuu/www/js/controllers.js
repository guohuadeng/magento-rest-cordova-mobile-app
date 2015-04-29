angular.module('app.controllers', [])

    .controller('AppCtrl', function ($scope, $ionicModal, MenuService, UserService, LoginService) {
        $scope.user = UserService.get();

        $scope.menus = MenuService.query();

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
            LoginService.get($scope.loginData);
        };

        $scope.exit = function () {
            if (confirm('Are you sure to exit the Kikuu app?')) {
                navigator.app.exitApp();
            }
        };
    })

    .controller('ListsCtrl', function ($scope, $stateParams, ProductsService) {
        $scope.parseInt = parseInt;
        $scope.title = $stateParams.title;

        var params = {
            limit: 50,
            page: 1
        };

        if (isNaN(+$stateParams.id)) {
            params.cmd = $stateParams.id;
        } else {
            params.cmd = 'catalog';
            params.categoryid = +$stateParams.id;
        }
        $scope.lists = ProductsService.query(params);
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
