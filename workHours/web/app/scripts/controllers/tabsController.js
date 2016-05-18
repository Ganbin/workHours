/**
 * This controller will handle the state of the tabs
 */
(function(angular,moment,utils){
	'use strict';
	
	var tabsController = function($scope,$wakanda,alertify,sharedData){
		var self = this;
		self.activeTab;
		
		/**
		 * Set the active tab of our application
		 */
		self.setActive = function (tab){
			self.activeTab = tab;
		};
		
		/**
		 * Check if a tab is active
		 */
		self.isActive = function (tab){
			if(tab === self.activeTab){
				return true;
			}else{
				return false;
			}
		};
		
		/**
		 * Broadcast event handler
		 */
		$scope.$on('handleBroadcast', function() {
			switch(sharedData.message){
				case 'logout':
					
				break;
			}
			
			if(typeof sharedData.message === 'object' && sharedData.message.action != null){
				switch(sharedData.message.action){
					case 'changeView': // Handle the change of tab when a controller send this message.action
						self.setActive(sharedData.message.value);
					break;
				}
			}
		});
		
	};
	
	angular.module('workTime').controller('tabs',tabsController);
	tabsController.$inject = ['$scope','$wakanda','alertify','mySharedData'];
	
}(window.angular,window.moment,window.utils));