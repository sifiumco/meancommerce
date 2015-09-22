'use strict';

//Products service used to communicate Products REST endpoints
angular.module('products').factory('Products', ['$resource',
  function($resource) {
    return {
      main: $resource('products/:productId', {
        productId: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      }),
      shop: $resource('products/:productId/shop', {
        productId: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      }),
      user: $resource('products/user', {
        productId: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      })
    };
    // return $resource('products/:productId', { productId: '@_id'
    // }, {
    //  update: {
    //    method: 'PUT'
    //  }
    // });
  }
]);
