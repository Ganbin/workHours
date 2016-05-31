(function(angular,moment,utils){
	'use strict';
	
	angular.module('workTime')
            
	.directive('login', function() {
		return {
			restrict: 'E',
	        templateUrl: 'scripts/directives/login/login.html',
	        controller: 'login',
	        controllerAs:'loginCtrl'
	    };
	});
	
}(window.angular,window.moment,window.utils));