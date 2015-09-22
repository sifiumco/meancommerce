'use strict';

// Users service used for communicating with the users/address REST endpoint
angular.module('users').factory('Address', ['$resource',
  function($resource) {
    return $resource('users/address/:addressId', {
      addressId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
