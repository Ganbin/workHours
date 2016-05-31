(function(angular,moment,utils){
	'use strict';
	
	var homeController = function($scope,$wakanda,alertify,sharedData){
		var self = this;
		/**
		 * Broadcast event handler
		 */
		$scope.$on('handleBroadcast', function() {
			switch(sharedData.message){
				case 'logout':
					self.message = 'Please get login to enjoy the application';
				break;
			}
			
			if(typeof sharedData.message === 'object' && sharedData.message.action != null){
				switch(sharedData.message.action){
					case 'loggedin': // This message is send when the user select an entity to edit
						self.message = "Welcome "+sharedData.message.fullName
					break;
					case 'removeTime':
						self.removeTime(sharedData.message.entity);
					break;
				}
			}
		});
		
		$wakanda.$currentUser().$promise.then(function(evt){
			self.logged = (evt.result === null) ? false : true;
			self.fullName = (evt.result === null) ? '' : evt.result.fullName;
			if(self.logged){
				sharedData.prepForBroadcast({action:'loggedin',fullName:self.fullName});
			}else{
				sharedData.prepForBroadcast('logout');
			}
		});
	
		sharedData.prepForBroadcast({action:'changeView',value:'home'}); // Broadcast the change of view
	
	};
	
	angular.module('workTime').controller('homeController',homeController);
	homeController.$inject = ['$scope','$wakanda','alertify','mySharedData'];

	
}(window.angular,window.moment,window.utils));