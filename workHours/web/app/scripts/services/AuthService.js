/**
 * 
 */
(function(angular, Promise){
	'use strict';
	
	angular.module('workTime')
	
	.factory('AuthService', function($rootScope,Session,$wakanda,mySharedData) {
		var authService = {};

		authService.login = function (name,pass) {
			return new Promise(function(resolve,refuse){
				$wakanda.$login(name,pass,20).$promise.then(function(evt){
					if(evt.result === true){
						$wakanda.$currentUser().$promise.then(function(evt){
							var currentUser = evt.result;
							Session.create(currentUser.ID, currentUser.userName, currentUser.fullName);
							resolve(currentUser);
						});
					}else{
						refuse(true);
					}
				});
			});
		};
		
		authService.logout = function () {
			return new Promise(function (resolve, refuse) {
				$wakanda.$logout().$promise.then(function(){
					Session.destroy();
					resolve(true);
				});
			});
		};

		authService.isAuthenticated = function () {
			return !!Session.userID;
		};
		
		/**
		 * Check if the user is loggedin
		 */
		 //debugger;
		authService.init = function () {
			return new Promise(function(resolve,refuse) {
				$wakanda.$currentUser().$promise.then(function(evt){
					var currentUser = evt.result;
			    	self.logged = (currentUser === null) ? false : true;
					self.fullName = (currentUser === null) ? '' : currentUser.fullName;
					if(self.logged){
						Session.create(currentUser.ID, currentUser.userName, currentUser.fullName);
						mySharedData.setData('logged',true)
						//mySharedData.prepForBroadcast({action:'loggedin',fullName:self.fullName});
					}else{
						mySharedData.setData('logged',false)
						//mySharedData.prepForBroadcast('logout');
					}
					resolve(true);
					console.log('resolve')
				});
			});
		};

		/**
		 * This part is if we have a role management
		 *
		 authService.isAuthorized = function (authorizedRoles) {
			if (!angular.isArray(authorizedRoles)) {
				authorizedRoles = [authorizedRoles];
			}
			return (authService.isAuthenticated() &&
				authorizedRoles.indexOf(Session.userRole) !== -1);
		};*/
		authService.promise = authService.init();

		return authService;
	});
	
}(window.angular,window.Promise));