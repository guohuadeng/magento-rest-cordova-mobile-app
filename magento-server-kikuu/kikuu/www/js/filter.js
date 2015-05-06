angular.module('app.filters', [])
    .filter('discount', function () {
        return function (product) {
            return ~~(-100 * (product.regular_price_with_tax -
                product.final_price_with_tax) /
                product.regular_price_with_tax) + '%';
        };
    });