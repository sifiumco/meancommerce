'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Categories',
  function($scope, Categories) {

    // Find all categories
    $scope.findCategories = function() {
      $scope.categories = Categories.query();
    };

  }
]);
