'use strict';

//Setting up route
angular.module('products').config(['$stateProvider',
  function($stateProvider) {
    var _isMobile = (function() {
      if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
        return true;
      } else {
        return false;
      }
    })();

    if (!_isMobile) {
      $stateProvider.
      state('listProducts', {
        url: '/products',
        templateUrl: 'modules/products/views/list-products.client.view.html',
        needUser: true
      }).
      state('listProductsByUser', {
        url: '/products/admin',
        templateUrl: 'modules/products/views/list-products-admin.client.view.html',
        needAdmin: true
      }).
      state('createProduct', {
        url: '/products/admin/create',
        templateUrl: 'modules/products/views/create-product.client.view.html',
        needAdmin: true
      }).
      state('addCategory', {
        url: '/products/admin/addCategory',
        templateUrl: 'modules/products/views/add-category-admin.client.view.html',
        needAdmin: true
      }).
      state('listProductsByUserAndCategory', {
        url: '/products/admin/:category',
        templateUrl: 'modules/products/views/list-products-admin.client.view.html',
        needAdmin: true
      }).
      state('editProduct', {
        url: '/products/admin/:productId/edit',
        templateUrl: 'modules/products/views/edit-product.client.view.html',
        needAdmin: true
      }).
      state('listProductsByCategory', {
        url: '/products/:category',
        templateUrl: 'modules/products/views/list-products.client.view.html',
        needUser: true
      });
    } else {
      $stateProvider.
      state('listProducts', {
        url: '/products',
        templateUrl: 'modules/products/views/mob_list-products.client.view.html',
        needUser: true
      }).
      state('listProductsByCategory', {
        url: '/products/:category',
        templateUrl: 'modules/products/views/mob_list-products.client.view.html',
        needUser: true
      });
    }
  }
]);
