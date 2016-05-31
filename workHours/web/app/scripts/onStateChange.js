(function(angular){
	'use strict';

	angular.module('workTime').run(['$rootScope','$state','AUTH_EVENTS','AuthService','mySharedData',function($rootScope,$state,AUTH_EVENTS,AuthService,mySharedData){
		$rootScope.$on('$viewContentLoading', function (event,next) {
			if(next.url !== '/home'){
				var isAuthenticated = AuthService.isAuthenticated();
				
				if(!isAuthenticated){
					event.preventDefault();
					mySharedData.prepForBroadcast(AUTH_EVENTS.notAuthenticated);
					$state.go('app.home')
				}
			}
		});
	}]);

}(window.angular));
