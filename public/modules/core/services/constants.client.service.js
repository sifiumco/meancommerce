'use strict';

angular.module('core').factory('Constants', [
	function() {
		return {
			noImage: 'http://epaper2.mid-day.com/images/no_image_thumb.gif',
			preloader: 'static/images/loader2.gif',
			addImage: 'https://upload.wikimedia.org/wikipedia/commons/0/09/Dummy_flag.png'
		};
	}
]);