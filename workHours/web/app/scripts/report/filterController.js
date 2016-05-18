/**
 * Report Filter Controller
 */
(function(angular,moment,utils){
	'use strict';
	
	var reportFilterController = function($scope,$state,$wakanda,alertify,sharedData){
		var self = this;
		self.loggedin = sharedData.getData('logged') || false;
		self.goToState = $state.go;
		
		self.from = new Date();
		self.to = new Date();
		
		self.categories = [];
		
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
							self.getAllClients();
						break;
					}
				}
			});

			var getReport = function (){
				var clientName,from,to,cat;
				
				from = self.from;
				to = self.to;
				if(self.clientSelected !== undefined && (self.allClients === undefined || self.allClients === false)){
					clientName = self.clientSelected.name;
				}
				
				ds.Client.getReport({from:from,to:to,clientName:clientName}).$promise.then(function(evt){
					self.categories = [];
					for(cat in evt.result){
						//debugger;
						self.categories.push({'name':cat,'time':evt.result[cat].time,'price':evt.result[cat].price,'addPrice':evt.result[cat].addPrice,'trainTime':evt.result[cat].trainTime,'label':evt.result[cat].label});
					}
					sharedData.prepForBroadcast({'action':'report','reportArr':self.categories,'clientName':clientName,from:from,to:to});
				});
			},
			
			// get all Clients
			getAllClients = function(){
				ds.Client.$all().$promise.then(function(evt){
					self.clients = evt.result;
					sharedData.setData('allCients',self.clients);
				});
			};

			self.getAllClients = getAllClients;
			self.getReport = getReport;
			
			self.getAllClients();
		});
	};
	
	angular.module('workTime').controller('reportFilterController',reportFilterController);
	reportFilterController.$inject = ['$scope','$state','$wakanda','alertify','mySharedData'];
	
}(window.angular,window.moment,window.utils));