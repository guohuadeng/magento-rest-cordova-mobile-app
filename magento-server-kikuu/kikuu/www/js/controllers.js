angular.module('app.controllers', [])

    .controller('AppCtrl', function ($scope, $rootScope, $ionicModal, $ionicTabsDelegate,$ionicLoading, $timeout) {
			
				//取数据时的loading mask
				$scope.showLoading = function() {
					$ionicLoading.show({
						template: 'Loading...'
					});
				};
				$scope.hideLoading = function(){
					$ionicLoading.hide();
				};
        // 用户信息
        $scope.getUser = function () {
            $rootScope.service.get('user', function (user) {
                $scope.user = user;
                $scope.$apply();
            });
        };
        $scope.getUser();
        // 菜单处理
        $rootScope.service.get('menus', function (menus) {
            $scope.menus = [
                {
                    cmd: 'daily_sale',
                    name: 'Daily Sale',
                    class_name: 'one-line'
                },
                {
                    cmd: 'best_seller',
                    name: 'New Arrival',
                    class_name: 'one-line'
                }
            ].concat(menus);
            $scope.$broadcast('menusData', $scope.menus);
        });
        $scope.setCatalog = function (index) {
            $scope.$broadcast('setCatalog', index);
        };

        // Form data for the login modal
        $scope.loginData = {};

        // Form data for the register modal
        $scope.registerData = {};
				
        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope,
            focusFirstInput: true
        }).then(function (modal) {
                $scope.modal = modal;
                $ionicTabsDelegate.select(0);
            });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
            $ionicTabsDelegate.select(0);
        };
        // Open the register modal
        $scope.register = function () {
            $scope.modal.show();
            $ionicTabsDelegate.select(1);
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            $rootScope.service.get('login', $scope.loginData, function (res) {
                if (res.code || res.message) {
                    alert(res.message || res.code);
                    return;
                }
                $scope.user = res;
                $scope.modal.hide();
            });
        };
				
        $scope.doLogout = function () {
            $rootScope.service.get('logout', $scope.getUser);
        };

        $scope.validationCodeDisabled = false;
        $scope.getValidationCode = function () {
            $scope.validationCodeDisabled = true;
            $scope.validationCode = ~~(Math.random() * 8999) + 1000;
            $scope.validateSeconds = 30;
            var update = function () {
                if ($scope.validateSeconds-- > 0) {
                    $timeout(update, 1000);
                } else {
                    $scope.validationCodeDisabled = false;
                }
            };
            update();
        };

        $scope.doRegister = function () {
						$scope.showLoading();
            $rootScope.service.get('register', $scope.registerData, function (res) {
                if (res[0]) {
                    alert('Welcome! User register success.\n Please login.');
		                $scope.doLogout();	
		                $scope.login();	
										$scope.hideLoading();
                    return;
                	}
								else	{
                    alert(res[2]);
										$scope.hideLoading();
                    return;								
									}				
            });
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
    //产品统一用这个名 Product-xx
    .controller('productDetailCtrl', function ($scope, $rootScope, $stateParams, $ionicSlideBoxDelegate) {
        $scope.productid = $stateParams.productid;
        $scope.qty = 1;
        $scope.updateSlider = function() {
            $ionicSlideBoxDelegate.update();
        };
        $scope.qtyAdd = function() {
	        $scope.qty = $scope.qty + 1;
        };
        $scope.qtyMinus = function() {
					if ($scope.qty > 1)
		        $scope.qty = $scope.qty - 1;
        };
				//取购物车商业品数量
				$rootScope.service.get('cartGetQty', {
						product: $stateParams.productid
				}, function (res) {
            $scope.items_qty = res.items_qty;
						$scope.$apply();
				});

        $rootScope.service.get('productDetail', {
            productid: $stateParams.productid
        }, function (results) {
            $scope.product = results;

            $rootScope.service.get('productImg', {
                product: $stateParams.productid
            }, function (lists) {
                $scope.productImg = lists;
                $scope.$apply();
            });

            if (results.has_custom_options) {
                $rootScope.service.get('productOption', {
                    productid: $stateParams.productid
                }, function (option) {
                    $scope.productOption = option;
                    $scope.$apply();
                });
            }
            $scope.$apply();
        });
				
        // Perform the add to cart
        $scope.doCartAdd = function () {					
						var queryString = $('#product_addtocart_form').formSerialize();
						if (!($scope.qty > 1))	{
							$scope.qty = 1 ;
            	$scope.$apply();
						}
            $rootScope.service.get('cartAdd', queryString, function (res) {
                if (res.result == 'error') {
                    alert(res.message);
                    return;
                }
                if (res.result == 'success') {
                    alert('Success');
                		$scope.items_qty = res.items_qty;
            				$scope.$apply();
                    return;
                }
            });
        };
        // End Perform the add to cart
    })
    //产品选项
    .controller('ProductOptionCtrl', function ($scope, $stateParams) {

    })

    .controller('DetailCtrl', function ($scope, $stateParams) {

    })

    .controller('SearchCtrl', function ($scope, $location) {
        $scope.model = {};
        //angular.element('#search-input').trigger('focus');
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
