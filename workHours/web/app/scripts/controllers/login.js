(function(angular,moment,utils){
	'use strict';
	
	var loginController = function($scope,$wakanda,alertify,sharedData){
		var self = this,logout,login;

		/**
		 * Broadcast event handler
		 */
		$scope.$on('handleBroadcast', function() {
			switch(sharedData.message){
				case 'logout':
					sharedData.setData('logged',false);
				break;
			}

			if(typeof sharedData.message === 'object' && sharedData.message.action != null){
				switch(sharedData.message.action){
					case 'loggedin':
						sharedData.setData('logged',true);
					break;
				}
			}
		});

		logout = function(){
			$wakanda.$logout().$promise.then(function(){
				self.logged = false;
				sharedData.prepForBroadcast('logout');
				alertify.log('Logged Out');
			});
		};

		login = function(name,pass){
			
			$wakanda.$login(name,pass,7200).$promise.then(function(evt){
				if(evt.result === true){
					$wakanda.$currentUser().$promise.then(function(evt){
						//debugger;
						self.logged = (evt.result === null) ? false : true;
						self.fullName = (evt.result === null) ? '' : evt.result.fullName;

						// tell the shared data service that we are logged in.
						sharedData.prepForBroadcast({action:'loggedin',fullName:self.fullName});

						alertify.success('Logged In');
					});
				}else{
					alertify.error('Wrong informations!');
				}
			});
		};

		/**
		 * Wakanda Initialization
		 */
		$wakanda.init().then(function(ds){ // COuld ride off this level
		    $wakanda.$currentUser().$promise.then(function(evt){
				self.logged = (evt.result === null) ? false : true;
				self.fullName = (evt.result === null) ? '' : evt.result.fullName;
				if(self.logged){
					sharedData.prepForBroadcast({action:'loggedin',fullName:self.fullName});
				}
			});
		});

		self.logout = logout;
		self.login = login;

	};

	angular.module('workTime').controller('login',loginController);
	loginController.$inject = ['$scope','$wakanda','alertify','mySharedData'];


}(window.angular,window.moment,window.utils));
