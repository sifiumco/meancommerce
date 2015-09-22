'use strict';

angular.module('core').controller('OrdersController', ['$scope', '$stateParams', '$http', 'Authentication', 'Order', 'Constants',
  function($scope, $stateParams, $http, Authentication, Order, Constants) {

    $scope.authentication = Authentication;

    $scope.Constants = Constants;

    $scope.getOneOrder = function() {
      Order
      .get({
        orderId: $stateParams.orderId
      })
      .$promise
      .then(function(order) {
        $scope.order = order;
        $scope.order.totalAmount = getTotalAmountOfCart(order.cart);
      })
      .catch(function(err) {
        $('.noOrderIdError').append('<div><h5 style="text-align:center; color:#ee6e73; padding-top:10%; padding-bottom:10%;">No Order with such Order ID exists.... Please enter correct ID...</h5></div>');
      });
    };

    $scope.getUserOrders = function() {
      $http
        .get('/orders/user')
        .success(function(orders) {
          $scope.orders = orders.map(function(order) {
            order.totalAmount = getTotalAmountOfCart(order.cart);
            return order;
          });
        })
        .catch(function(err) {
          console.log('err', err);
          alert(err);
        });
    };

    $scope.getAllOrders = function() {
      $http
        .get('/orders')
        .success(function(orders) {
          $scope.orders = orders.map(function(order) {
            order.totalAmount = getTotalAmountOfCart(order.cart);
            return order;
          });
          setTimeout(function() {
            $('.dropdown-button').dropdown();
          }, 0);
        })
        .catch(function(err) {
          console.log('err', err);
          alert(err);
        });
    };

    $scope.changeStatus = function(order, status) {
      order.status = status;
      new Order(order).$update(function() {
        console.log('status changes to ' + status);
      });
    };

    var getTotalAmountOfCart = function(cart) {
      var totalAmount = 0;
      cart.forEach(function(item) {
        totalAmount += item.product ? item.product.price * item.items : 0;
      });
      return totalAmount;
    };

  }
]);
