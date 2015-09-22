'use strict';

angular.module('core').controller('OrdersAdminController', ['$scope', 'Authentication',
	function($scope, Authentication) {

    $scope.authentication = Authentication;

	}
]);