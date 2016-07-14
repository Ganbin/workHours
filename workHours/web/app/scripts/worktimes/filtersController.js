/**
 * Worktime Filter Controller
 */
(function(angular,moment,utils){
	'use strict';
	
	var workTimeFiltersController = function($scope,$state,$wakanda,alertify,sharedData,Session){
		var self = this;
		self.loggedin = sharedData.getData('logged') || false;
		self.goToState = $state.go;
		
		self.from = new Date();
		self.from.setDate(1);
		self.to = new Date();
		
		self.show = false;
		
		self.categories = [];
		
		self.onlyMine = true;
		
		self.allClients = true;
		
		self.Session = Session;
		self.userSelected = {ID:self.Session.userID ,name: self.Session.userFullName};
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
				
				var dataClass = self.onlyMine ? ds.UserTime : ds.WorkTime,
					userName = self.onlyMine === true ? Session.userFullName : (self.userSelected != null) ? self.userSelected.name : '*';
				
				self.from.setHours(0);
				self.from.setMinutes(0);
				self.to.setHours(23);
				self.to.setMinutes(59);
				
				sharedData.setData('selfTimeFilter',self);
				
				if(self.clientSelected != null && self.allClients !== true){
					dataClass.$query({filter:'start > :1 && end < :2 and clientName == :3 and userName == :4',params:[self.from,self.to,self.clientSelected.name,userName],orderBy:'start desc',pageSize:20}).$promise.then(function(evt){
						sharedData.prepForBroadcast({'action':'filter','result':evt.result,'clientName':self.clientSelected.name,from:self.from,to:self.to,showUser:!self.onlyMine,userName:userName});
					});
				} else {
					dataClass.$query({filter:'start > :1 && end < :2 and userName == :3',params:[self.from,self.to,userName],orderBy:'start desc',pageSize:20}).$promise.then(function(evt){
						sharedData.prepForBroadcast({'action':'filter','result':evt.result,from:self.from,to:self.to,showUser:!self.onlyMine,userName:userName});
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
			},
			
			onlyMineClick = function (result) {
				if(result){
					this.userSelected = {ID:this.Session.userID ,name: this.Session.userFullName};
				}
			};

			ds.Utility.getUserNames().$promise.then(function (evt) {
				self.users = evt.result;
			});

			self.getAllClients = getAllClients;
			self.onlyMineClick = onlyMineClick;
			self.filter = filter;
			//debugger;
			//self = sharedData.getData('selfTimeFilter') === false ? self : sharedData.getData('selfTimeFilter')
			//debugger;
			self.getAllClients();
		});
	};
	
	angular.module('workTime').controller('workTimeFiltersController',workTimeFiltersController);
	workTimeFiltersController.$inject = ['$scope','$state','$wakanda','alertify','mySharedData','Session'];
	
}(window.angular,window.moment,window.utils));