'use strict';

angular.module('products').directive('collapsibleCategories', ['$timeout',
  function($timeout) {
    return {
      link: function($scope, element, attrs) {
        $scope.$on('collapsibleLoaded', function() {
          $timeout(function() {
            $('#' + $scope.selectedCategory._id).addClass('active');
            $('#' + $scope.selectedCategory._id + ' .collapsible-header').addClass('active');
            $('#' + $scope.selectedCategory._id + ' .collapsible-body').css('display', 'block');
          }, 0, false);
        });
      }
    };
  }
]);
