/**
 * Worktime Filter Controller
 */
(function(angular,moment,utils){
	'use strict';
	
	var workTimeFiltersController = function($scope,$state,$wakanda,alertify,sharedData){
		var self = this;
		self.loggedin = sharedData.getData('logged') || false;
		self.goToState = $state.go;
		
		self.from = new Date();
		self.to = new Date();
		
		self.show = false;
		
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

			var filter = function (){
				self.from.setHours(0);
				self.from.setMinutes(0);
				self.to.setHours(23);
				self.to.setMinutes(59);
				//debugger;
				if(self.clientSelected != null && self.allClients !== true){
					ds.UserTime.$query({filter:'start > :1 && end < :2 and clientName == :3',params:[self.from,self.to,self.clientSelected.name]}).$promise.then(function(evt){
						sharedData.prepForBroadcast({'action':'filter','result':evt.result,'clientName':self.clientSelected.name,from:self.from,to:self.to});
					});
				} else {
					ds.UserTime.$query({filter:'start > :1 && end < :2',params:[self.from,self.to]}).$promise.then(function(evt){
						sharedData.prepForBroadcast({'action':'filter','result':evt.result,from:self.from,to:self.to});
					});
				}
			},
			
			// get all Clients
			getAllClients = function(){
				ds.Client.$all().$promise.then(function(evt){
					self.clients = evt.result;
					sharedData.setData('allCients',self.clients);
					
					// Activate the floatlabels
					setTimeout(function(){
						$('.form-control').on('focus blur', function (e) {
						    $(this).parents('.form-group').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
						}).trigger('blur');
					},500);
					
				},function(err){
					sharedData.prepForBroadcast('logout');
				});
			};

			self.getAllClients = getAllClients;
			self.filter = filter;
			
			self.getAllClients();
		});
	};
	
	angular.module('workTime').controller('workTimeFiltersController',workTimeFiltersController);
	workTimeFiltersController.$inject = ['$scope','$state','$wakanda','alertify','mySharedData'];
	
}(window.angular,window.moment,window.utils));