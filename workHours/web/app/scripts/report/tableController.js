/**
 * Report Table Controller
 */
(function(angular,moment,utils){
	'use strict';
	
	var reportTableController = function($scope,$state,$wakanda,alertify,sharedData){
		var self = this;
		self.loggedin = sharedData.getData('logged') || false;
		self.goToState = $state.go;
		self.report = [];
		self.clientName = 'tout les clients';
		
		/**
		 * Wakanda Initialization
		 */
		$wakanda.init().then(function(ds){
			/**
			 * Broadcast event handler
			 */
			$scope.$on('handleBroadcast', function() {
				switch(sharedData.message){
					case 'logout':
						self.loggedin = false;
					break;
				}

				if(typeof sharedData.message === 'object' && sharedData.message.action !== undefined){
					switch(sharedData.message.action){
						case 'loggedin':
							self.loggedin = true;
						break;
						case 'report':
							self.categories = sharedData.message.reportArr;
							self.clientName = sharedData.message.clientName || 'tout les clients';
							self.from = sharedData.message.from;
							self.to = sharedData.message.to;
						break;
					}
				}
			});

			var getReport = function(options){
				
			};

			self.getReport = getReport;
		});
	};
	
	angular.module('workTime').controller('reportTableController',reportTableController);
	reportTableController.$inject = ['$scope','$state','$wakanda','alertify','mySharedData'];
	
}(window.angular,window.moment,window.utils));