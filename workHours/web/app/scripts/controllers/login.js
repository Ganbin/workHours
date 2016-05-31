(function(angular,moment,utils){
	'use strict';
	
	var loginController = function($scope,$wakanda,alertify,sharedData,AUTH_EVENTS,AuthService){
		var self = this,logout,login;

		/**
		 * Broadcast event handler
		 */
		$scope.$on('handleBroadcast', function() {
			switch(sharedData.message){
				case 'auth-not-authenticated':
				case 'logout':
					sharedData.setData('logged',false);
					self.logged = false;
					AuthService.logout();
				break;
			}

			if(typeof sharedData.message === 'object' && sharedData.message.action != null){
				switch(sharedData.message.action){
					case 'loggedin':
						sharedData.setData('logged',true);
						self.logged = true;
					break;
				}
			}
		});

		logout = function(){
			AuthService.logout().then(function (result){
				self.logged = false;
				sharedData.prepForBroadcast('logout');
				alertify.log('Logged Out');
				$scope.$digest(); // Force digest cycle when logout
			});
		};

		login = function(){
			AuthService.login(self.name,self.pass).then(function (currentUser) {
				self.fullName = currentUser.fullName;
				// tell the shared data service that we are logged in.
				sharedData.prepForBroadcast({action:'loggedin',fullName:currentUser.fullName});
				//sharedData.prepForBroadcast(AUTH_EVENTS.loginSuccess);
				$scope.appCtrl.setCurrentUser(currentUser);
				$scope.$digest(); // Force digest cycle when login
				alertify.success('Logged In');
			},function () {
				alertify.error('Wrong informations!');
				sharedData.prepForBroadcast(AUTH_EVENTS.loginFailed);
			});
		};

		/**
		 * Wakanda Initialization
		 */
	    $wakanda.$currentUser().$promise.then(function(evt){
			self.logged = (evt.result === null) ? false : true;
			self.fullName = (evt.result === null) ? '' : evt.result.fullName;
			if(self.logged){
				sharedData.prepForBroadcast({action:'loggedin',fullName:self.fullName});
			}else{
				sharedData.prepForBroadcast('logout');
			}
		});

		self.logout = logout;
		self.login = login;

	};

	angular.module('workTime').controller('login',loginController);
	loginController.$inject = ['$scope','$wakanda','alertify','mySharedData','AUTH_EVENTS','AuthService'];


}(window.angular,window.moment,window.utils));
