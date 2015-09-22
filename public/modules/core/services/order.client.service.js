'use strict';

angular.module('core').factory('Order', ['$resource',
	function($resource) {
		return $resource('orders/:orderId', { orderId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);