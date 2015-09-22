'use strict';

angular.module('core').controller('CheckoutController', ['$scope', '$http', '$location', 'Authentication', 'Address', 'Cart',
  function($scope, $http, $location, Authentication, Address, Cart) {

    $scope.authentication = Authentication;

    $scope.$watch(function() {
      return Cart.getCart();
    }, function(newVal) {
      $scope.cart = Cart.getCart();
      calculateCartPrice();
    }, true);

    $scope.init = function() {
      $scope.user = $scope.authentication.user ? $scope.authentication.user : null;
    };

    $scope.openCart = function() {
      $('#b1').click();
    };

    $scope.addAddress = function() {
      if (!$scope.authentication.user) {
        if (!$scope.user) {
          $scope.user = {
            address: []
          };
          $scope.address._id = 0;
        } else if (!$scope.user.address) {
          $scope.user.address = [];
          $scope.user = $.extend(true, {}, {
            address: []
          });
          $scope.address._id = 0;
        } else {
          $scope.address._id = $scope.user.address.length;
        }
        $scope.user.address.push($.extend(true, {}, $scope.address));
        $scope.selectAddress($scope.address);
        return;
      }
      var address = new Address({
        addressLine_1: $scope.address.addressLine_1,
        addressLine_2: $scope.address.addressLine_2,
        city: $scope.address.city,
        state: $scope.address.state,
        zip: $scope.address.zip
      });
      address.$update(function(user) {
        $scope.authentication.user.address = user.address;
        $scope.user.address = user.address;
        $scope.address = '';
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.selectAddress = function(address) {
      $scope.selectedAddress = address;
      $scope.address = $.extend(true, {}, address);
    };

    $scope.checkout = function() {
      if (!Cart.getCart() || Cart.getCart().length === 0) {
        alert('Please select a product to buy');
        return;
      }
      if (!$scope.selectedAddress && !$scope.address) {
        alert('Please select/input a address');
        return;
      }
      if (!$scope.user) {
        alert('Please enter above details');
        return;
      }
      if ($scope.user && !$scope.user.phone) {
        $scope.error = 'Please enter your phone number';
        return;
      }
      if ($scope.user && !$scope.user.email) {
        $scope.error = 'Please enter your email id';
        return;
      }
      if ($scope.user && (!$scope.user.firstName || !$scope.user.lastName)) {
        $scope.error = 'Please enter your name';
        return;
      }
      $http({
          method: 'POST',
          url: '/users/checkout',
          data: $.param({
            user: $scope.user,
            cart: Cart.getCart(),
            address: $scope.selectedAddress ? $scope.selectedAddress : $scope.address
          }),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then(function(data) {
          if ($scope.authentication.user) {
            $scope.authentication.user.cart = [];
          } else {
            Cart.emptyCart();
          }
          $location.path('/order/' + data.data.order._id);
        })
        .catch(function(err) {
          console.log('err', err);
          alert(err.data.message);
        });
    };

    var calculateCartPrice = function() {
      var cart = Cart.getCart();
      var total = 0;
      if (cart && cart.length !== 0) {
        cart.forEach(function(cartItem) {
          total += cartItem.items * cartItem.product.price;
        });
      }
      $scope.cartPrice = total;
    };
    setTimeout(function() {

      $('.modal-trigger8').leanModal();

    }, 0);

  }
]);
