'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$location', '$rootScope', '$state', 'Authentication', 'Menus', 'Users', 'Constants', 'Cart',
    function($scope, $location, $rootScope, $state, Authentication, Menus, Users, Constants, Cart) {
        $scope.authentication = Authentication;

        $scope.Constants = Constants;
        // $scope.isCollapsed = false;
        $scope.forgotPassword = false;
        $scope.menu = Menus.getMenu('topbar');

        $scope.hideSearch = true;

        var updateCart = true;

        $scope.$watch(function() {
            return Cart.getCart();
        }, function(newVal) {
            if (updateCart) {
                $scope.cart = Cart.getCart();
            } else {
                updateCart = true;
            }
            calculateCartPrice();
        }, true);

        $scope.$watch(function(scope) {
            return scope.authentication.user;
        }, function(newVal) {
            if (newVal && $scope.authentication.user.roles.indexOf('admin') === -1) {
                Cart.mergeCart(function(cart) {
                    $scope.authentication.user.cart = cart;
                });
            }
        });

        // $scope.toggleCollapsibleMenu = function() {
        //   $scope.isCollapsed = !$scope.isCollapsed;
        // };

        $scope.goToHome = function() {
            $state.go('home');
        };

        $scope.openRegisterModal = function() {
            $('#modal2').closeModal();
            if ($('#modal1').css('display') === 'none') {
                $('.lean-overlay').remove();
                $('#modal1').openModal();
            } else {
                $('.lean-overlay').remove();
                $('#modal1').closeModal();
            }
        };

        $scope.openLoginModal = function() {
            $('#modal1').closeModal();
            if ($('#modal2').css('display') === 'none') {
                $('.lean-overlay').remove();
                $('#modal2').openModal();
            } else {
                $('.lean-overlay').remove();
                $('#modal2').closeModal();
            }
        };

        $scope.openCart = function() {
            setTimeout(function() {
                if ($('#modal3').css('display') === 'none') {
                    $('#cart-icon').click();
                }
            }, 100);
        };

        $scope.search = function(searchTerm) {
            if (!searchTerm || searchTerm === '') {
                return;
            }
            $rootScope.searchTerm = searchTerm.trim();
            $location.path('/products');
        };

        $scope.showForgotPasswordDialog = function() {
            $scope.forgotPassword = !$scope.forgotPassword;
        };

        $scope.increaseItem = function(cartItem) {
            updateCart = false;
            Cart.increaseItem(cartItem, function(items) {
                cartItem.items = items;
            });
        };

        $scope.decreaseItem = function(cartItem) {
            updateCart = false;
            Cart.decreaseItem(cartItem, function(items) {
                if (items <= 0) {
                    $scope.cart = Cart.getCart();
                } else {
                    cartItem.items = items;
                }
            });
        };

        $scope.setItemsByNo = function(product, items) {
            updateCart = false;
            Cart.setItemsByNo(product, items, function(cart) {
                if ($scope.authentication.user) {
                    $scope.authentication.user.cart = cart;
                }
            });
        };

        $scope.removeItem = function(product) {
            updateCart = true;
            Cart.removeItem(product, function(cart) {
                $scope.authentication.user.cart = cart;
            });
        };
        $scope.addtocart = function() {

        };
        $scope.checkout = function() {
            if ($scope.authentication.user) {
                $location.path('/checkout');
            } else {
                if (confirm('Are you sure you want to checkout without logging in?')) {
                    $location.path('/checkout');
                }
            }
            $('#d1').css('display', 'none');
            // $('#modal3').closeModal();
        };

        $scope.displayLoginBox = function() {
            $scope.hideSearch = !$scope.hideSearch;
        };

        setTimeout(function() {
            $('.button-collapse').sideNav({
                menuWidth: 220, // Default is 240
                edge: 'right', // Choose the horizontal origin

            });
            $('.modal-trigger').leanModal();
            $('.modal-trigger1').leanModal();
            $('.modal-trigger2').leanModal();
            $('.modal-trigger5').leanModal();
            $('.modal-trigger6').leanModal();
            $('.modal-trigger10').leanModal();
            $('.dropdown-button2').dropdown({
                inDuration: 300,
                outDuration: 225,
                constrain_width: false, // Does not change width of dropdown to that of the activator
                hover: true, // Activate on hover
                gutter: 0, // Spacing from edge
                belowOrigin: true // Displays dropdown below the button
            });
            $('#cssmenu').prepend('<div id="menu-button">Menu</div>');
            $('#cssmenu #menu-button').on('click', function() {
                var menu = $(this).next('ul');
                if (menu.hasClass('open')) {
                    menu.removeClass('open');
                } else {
                    menu.addClass('open');
                }
            });
            $('#b1').click(function() {
                // $('#d1').toggleClass("divhide");
                $('#d1').fadeToggle('slow');
            });
            $( 'd1').slideToggle( 'slow' );
            $('.dropdown-button').dropdown({
                inDuration: 300,
                outDuration: 225,
                constrain_width: false,
                hover: false,
                gutter: 0,
                belowOrigin: false
            });
        }, 0);



        var calculateCartPrice = function() {
            var cart = Cart.getCart();
            var total = 0;
            if (cart && cart.length !== 0) {
                cart.forEach(function(cartItem) {
                    total += cartItem.items * cartItem.product.price;
                });
            }
            $scope.cartPrice = total;
            $scope.cartItems = cart ? cart.length : 0;
        };

        Array.prototype.indexOfCartItem = function(item) {
            for (var i = this.length - 1; i >= 0; --i) {
                if (this[i]._id === item._id) break;
            }
            return i;
        };

        $('#search').on('click', function(e) {
            $('#search1').toggle();
            $(this).toggleClass('class1');
        });
    }
]);
