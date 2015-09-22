'use strict';

angular.module('core').factory('Util', [
  function() {
    return {
      indexOfCartItem: function(cart, item) {
        for (var i = cart.length - 1; i >= 0; --i) {
          if (cart[i].product._id === item.product._id) break;
        }
        return i;
      }
    };
  }
]);
