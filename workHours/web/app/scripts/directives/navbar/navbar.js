(function(angular,moment,utils){
	'use strict';
	
	angular.module('workTime')
	           
	.directive('navBar', function() {
		return {
			restrict: 'E',
	        templateUrl: 'scripts/directives/navbar/navbar.html',
	        controller: 'tabs',
	        controllerAs:'tabCtrl'
	    };
	});
	
}(window.angular,window.moment,window.utils));