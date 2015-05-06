(function (angular) {
    'use strict';
    angular.module('sample-app', ['afkl.lazyImage'])
    .controller('appCtrl', ['$scope', function mainCtrl($scope) {

        $scope.destroy = function() {
            $scope.images = null;
            $scope.$destroy();
        };

        $scope.changeImage = function () {
            var color = Math.floor(Math.random()*16777215).toString(16);
            $scope.runtimeImageSrc = '//placehold.it/768x599/' + color + '/ffffff';
        }

        $scope.changeImage();
    }]);

})(angular);