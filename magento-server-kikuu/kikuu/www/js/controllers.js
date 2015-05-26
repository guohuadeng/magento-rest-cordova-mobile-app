angular.module('app.controllers', [])

    .controller('AppCtrl', function ($scope, $rootScope, $ionicModal, $ionicTabsDelegate, $ionicLoading, $ionicPopup, $timeout) {
        //取数据时的loading mask
        $scope.showLoading = function () {
            $ionicLoading.show({
                template: 'Loading...'
            });
						/*
            $timeout(function () {
								$scope.showAlert('Alert!','Can not load data! Please check your network');
                $ionicLoading.hide(); //close the popup after 3 seconds for some reason
            }, 10000);
						*/
        };
        $scope.hideLoading = function () {
            $ionicLoading.hide();
        };

        //各种弹出信息
        // Triggered on a button click, or some other target
        $scope.showPopupForgotPwd = function (_title, _content) {
            $scope.data = {};

            // An elaborate, custom popup
            var myPopup = $ionicPopup.prompt({
                template: '<input autofocus class="padding-left" type="text" ng-model="loginData.username">',
                title: 'Enter your email',
                subTitle: 'This would take a little longer. Please wait...',
								inputType: 'email',
                scope: $scope,	
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Submit</b>',
                        type: 'button-assertive',
                        onTap: function (e) {
                            if (!$scope.loginData.username) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                            } else {
																$scope.loginData.email = $scope.loginData.username
                                $scope.showLoading();
                                $rootScope.service.get('forgotpwd', $scope.loginData, function (res) {
                                    if (res.code == '0x0000') {
                                        $scope.showAlert('Success', res.message);
                                        $scope.hideLoading();
                                        return;
                                    }
                                    else {
                                        $scope.showAlert('Alert!', 'Error code:' + res.code + '</br>' + res.message);
                                        $scope.hideLoading();
                                        return;
                                    }
                                });
                                return $scope.registerData.email;
                            }
                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
            $timeout(function () {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 30000);
        };
        $scope.showLogin = function () {
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                templateUrl: 'templates/login.html',
                title: 'Login',
								cssClass: 'login-container',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Login</b>',
                        type: 'button-assertive',
                        onTap: function (e) {
                            if (!$scope.registerData.email) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                            } else {
                                $scope.showLoading();
                                $rootScope.service.get('forgotpwd', $scope.registerData, function (res) {
                                    if (res.code == '0x0000') {
                                        $scope.showAlert('Success', res.message);
                                        $scope.hideLoading();
                                        return;
                                    }
                                    else {
                                        $scope.showAlert('Alert!', 'Error code:' + res.code + '</br>' + res.message);
                                        $scope.hideLoading();
                                        return;
                                    }
                                });
                                return $scope.registerData.email;
                            }
                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
        };
        // A confirm dialog
        $scope.showConfirmExit = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Confirm',
                template: 'Are you sure to exit the Kikuu App?',
                okType: 'button-assertive'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    console.log('You are exit');
                    navigator.app.exitApp();
                } else {
                    console.log('You are not sure');
                }
            });
        };

        // An alert dialog
        $scope.showAlert = function (_title, _content) {
            var alertPopup = $ionicPopup.alert({
                title: _title,
                template: _content,
                okType: 'button-assertive'
            });
            alertPopup.then(function (res) {
                console.log('Thank you for not eating my delicious ice cream cone');
            });
        };

        //end 各种弹出信息

        //首次欢迎页
        $scope.welcome = function () {
            var myt = '<ion-slide-box show-pager="false">'
                + '<ion-slide><img class="fullwidth" ng-src="img/spash1.png"></ion-slide>'
                + '<ion-slide><img class="fullwidth" ng-src="img/spash2.png"></ion-slide>'
                + '<ion-slide><img class="fullwidth" ng-src="img/spash3.png"></ion-slide>'
                + '</ion-slide-box>';
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: myt,
                title: 'Welcome to Kikuu',
                cssClass: 'popupFullscreen',
                scope: $scope,
                buttons: [
                    { text: 'Enter Kikuu',
                        type: 'button-energized'}
                ]
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
        };
        if (!localStorage['first-use']) {
            localStorage['first-use'] = true;
            $timeout(function () {
                $scope.welcome();
            }, 50);
        }
        //end 首次欢迎页
        // 网站列表信息
        $scope.getWebsite = function () {
            $rootScope.service.get('website', function (website) {
                $scope.website = website;
                $scope.$apply();
            });
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
                }
                /* 客户要求，去掉New Arrival
                 {
                 cmd: 'best_seller',
                 name: 'New Arrival',
                 class_name: 'one-line'
                 }
                 */
            ].concat(menus);
            $scope.$broadcast('menusData', $scope.menus);
        });
        $scope.setCatalog = function (index) {
            $scope.$broadcast('setCatalog', index);
        };
        $scope.$on('selectedIndex', function (e, index) {
            $scope.selectedIndex = index;
        });
        $scope.getActiveClass = function (index) {
            return $scope.selectedIndex === index;
        };

        // Form data for the login modal
        $scope.loginData = {};

        // Form data for the register modal
        $scope.registerData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
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
        };
        // Open the register modal
        $scope.register = function () {
            $scope.modal.hide();
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
            if (!($scope.registerData.password == $scope.registerData.confirmation)) {
                $scope.showAlert('Alert!', 'Please confirm you password!');
                return;
            }
            ;
            $scope.showLoading();
            $rootScope.service.get('register', $scope.registerData, function (res) {
                if (res[0]) {
                    $scope.showAlert('Success!', 'Welcome! User register success.\n Please login.');
                    $scope.doLogout();
                    $scope.loginData.username = $scope.registerData.email;
                    $scope.login();
                    $scope.hideLoading();
                    return;
                }
                else {
                    $scope.showAlert('Alert!', res[2]);
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
    //列表
    .controller('ListsCtrl', function ($scope, $rootScope) {
        var getList = function (tab, type, callback) {
            if (type === 'load') {
                tab.page++;
            } else {
                tab.page = 1;
            }

            var params = {
                limit: 20,
                page: tab.page,
                cmd: tab.cmd || 'catalog'
            };
            if (tab.category_id) {
                params.categoryid = +tab.category_id;
            }
						$scope.showLoading();
            $rootScope.service.get('products', params, function (lists) {
                if (type === 'load') {
                    if (lists) {
                        tab.lists = tab.lists.concat(lists);
                    } else {
                        tab.loadOver = true;
                    }
                } else {
                    tab.lists = lists;
                }
                tab.hasInit = true;
                $scope.$apply();
                if (typeof callback === 'function') {
                    callback();
                }
            });
						
						$scope.hideLoading();		
        };

        // 根据菜单生成 tabs
        $scope.$on('menusData', function (e, menus) {
            $scope.menus = menus;
            $scope.tabs = menus.slice(0);
            $scope.$apply();
            $scope.selectedIndex = 0;
        });
        $scope.$on('setCatalog', function (e, index) {
            $scope.selectedIndex = index;
        });
        $scope.$watch('selectedIndex', function () {
            if (!$scope.tabs) {
                return;
            }
            var tab = $scope.tabs[$scope.selectedIndex];

            $scope.$emit('selectedIndex', $scope.selectedIndex);

            if (tab.hasInit) {
                return;
            }
            getList(tab, 'refresh');
        });

        $scope.doRefresh = function (index) {
            getList($scope.tabs[index], 'refresh', function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
        };
        $scope.loadMore = function (index) {
            getList($scope.tabs[index], 'load', function () {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        };
    })
    //产品统一用这个名 Product-xx
    .controller('productDetailCtrl', function ($scope, $rootScope, $stateParams, $ionicPopup, $ionicSlideBoxDelegate, $cordovaSocialSharing) {	
        $scope.showLoading();
        $scope.productid = $stateParams.productid;
        $scope.qty = 1;
        $scope.showShare = true;
        $scope.updateSlider = function () {
            $ionicSlideBoxDelegate.update();
        };
        //取购物车商品数量
        $rootScope.service.get('cartGetQty', {
            product: $stateParams.productid
        }, function (res) {
            $scope.items_qty = res.items_qty;
            $scope.$apply();
        });
        //取商品详情
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
        	//取商品选项
            if (results.has_custom_options) {
                $rootScope.service.get('productOption', {
                    productid: $stateParams.productid
                }, function (option) {
                    $scope.productOption = option;
                    $scope.$apply();
                });
            }
            $scope.$apply();
        		$scope.hideLoading();
        });
				//分享
        $scope.onShare = function () {
            $cordovaSocialSharing.share($scope.product.name, $scope.product.name, '', $scope.product.url_key);
        };
        //全屏幕图片
        $scope.imageFullscreen = function () {
            $scope.currentSlide = $ionicSlideBoxDelegate.currentIndex();
            var myt = '<ion-slide-box delegate-handle="image-viewer" show-pager="false" active-slide="'
                + $ionicSlideBoxDelegate.currentIndex() + '"><ion-slide ng-repeat="img in productImg" ng-init="updateSlider()"><a href="#"><img class="fullwidth" ng-src="{{img.url}}"></a></ion-slide></ion-slide-box>';
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: myt,
                title: '',
                cssClass: 'popupFullscreen',
                scope: $scope,
                buttons: [
                    {
                        text: '< ',
                        type: 'button-light',
                        onTap: function (e) {
														$ionicSlideBoxDelegate.previous();
											      e.preventDefault();
                            }
                     },
                    { text: 'Close' ,
                        type: 'button-light',},
                    { text: '>',
                        type: 'button-light',
                        onTap: function (e) {
														$ionicSlideBoxDelegate.next();
											      e.preventDefault();
                            } 
										}
                ]
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
        };
        //end 全屏幕图片

				//增减数量操作
        $scope.qtyAdd = function () {
            $scope.qty = $scope.qty + 1;
        };
        $scope.qtyMinus = function () {
            if ($scope.qty > 1)
                $scope.qty = $scope.qty - 1;
        };
				//end 增减数量操作
        // Perform the add to cart
        $scope.doCartAdd = function () {
            var queryString = $('#product_addtocart_form').formSerialize();
            if (!($scope.qty > 1)) {
                $scope.qty = 1;
                $scope.$apply();
            }
            $rootScope.service.get('cartAdd', queryString, function (res) {
                if (res.result == 'error') {
                    $scope.showAlert('Alert!', res.message);
                    return;
                }
                if (res.result == 'success') {
                    $scope.showAlert('Success', res.items_qty + '&nbsp;items already in your cart.');
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
    //login选项
    .controller('LoginCtrl', function ($scope, $ionicPopup) {

    })

    .controller('FrameCtrl', function ($scope, $sce, $stateParams, Config) {
        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        };

        var frame = Config.frames[$stateParams.page];
        $scope.title = frame.title;
        $scope.src = frame.src;
    });
