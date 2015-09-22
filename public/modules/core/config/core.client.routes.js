'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');

    var _isMobile = (function() {
      if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
        return true;
      } else {
        return false;
      }
    })();

    console.log('_isMobile', _isMobile);

    if (!_isMobile) {
      $stateProvider.
        // state('admin', {
        //  url: '/admin',
        //  templateUrl: 'modules/core/views/admin.client.view.html'
        // }).

      state('home', {
        url: '/',
        templateUrl: 'modules/core/views/home.client.view.html',
        needUser: true
      }).
      state('contact', {
        url: '/contact-us',
        templateUrl: 'modules/core/views/contact.client.view.html',
        needUser: true
      }).
      state('about', {
        url: '/about-us',
        templateUrl: 'modules/core/views/about.client.view.html',
        needUser: true
      }).
      state('policy', {
        url: '/policy',
        templateUrl: 'modules/core/views/policy.client.view.html',
        needUser: true
      }).
      state('checkout', {
        url: '/checkout',
        templateUrl: 'modules/core/views/checkout.client.view.html',
        needUser: true
      }).
      state('checkoutSuccess', {
        url: '/order/:orderId',
        templateUrl: 'modules/core/views/order.client.view.html',
        needUser: true
      }).
      state('listOrders', {
        url: '/orders',
        templateUrl: 'modules/core/views/list-orders.client.view.html',
        needUser: true
      }).
      state('listAllOrders', {
        url: '/orders/admin',
        templateUrl: 'modules/core/views/list-orders-admin.client.view.html',
        needAdmin: true
      });
    } else {
      $stateProvider.
        // state('admin', {
        //  url: '/admin',
        //  templateUrl: 'modules/core/views/admin.client.view.html'
        // }).

      state('home', {
        url: '/',
        templateUrl: 'modules/core/views/mob_home.client.view.html',
        needUser: true
      }).
      state('contact', {
        url: '/contact-us',
        templateUrl: 'modules/core/views/contact.client.view.html',
        needUser: true
      }).
      state('about', {
        url: '/about-us',
        templateUrl: 'modules/core/views/about.client.view.html',
        needUser: true
      }).
      state('policy', {
        url: '/policy',
        templateUrl: 'modules/core/views/policy.client.view.html',
        needUser: true
      }).
      state('checkout', {
        url: '/checkout',
        templateUrl: 'modules/core/views/checkout.client.view.html',
        needUser: true
      }).
      state('checkoutSuccess', {
        url: '/order/:orderId',
        templateUrl: 'modules/core/views/order.client.view.html',
        needUser: true
      }).
      state('listOrders', {
        url: '/orders',
        templateUrl: 'modules/core/views/list-orders.client.view.html',
        needUser: true
      }).
      state('listAllOrders', {
        url: '/orders/admin',
        templateUrl: 'modules/core/views/list-orders-admin.client.view.html',
        needAdmin: true
      });
    }

  }
]);
