/**
 * Clients Controller
 */
(function(angular,moment,utils){
	'use strict';
	
	var clientsController = function($scope,$state,$wakanda,alertify,sharedData){
		var self = this;
		
		self.loggedin = sharedData.getData('logged') || false;
		self.displayForm = false;
		self.goToState = $state.go;
		
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
					case 'saved':
						self.getAll({orderBy:''});
					break;
				}

				if(typeof sharedData.message === 'object' && sharedData.message.action !== undefined){
					switch(sharedData.message.action){
						case 'removeClient':
							//self.remove(sharedData.message.entity); we do it in the form controller
						break;
						case 'loggedin':
							//self.getAllClients();
							//self.getAllCategories();
							self.loggedin = true;
							self.getAll({orderBy:''});
							// If not params, I set the form as a new entity to add
							if(self.ID !== ''){
								//getEntity(self.ID);
							} else {
								//self.setNewEntity();
							}
						break;
					}
				}
			});

			var getAll = function(options){
				ds.Client.$all(options).$promise.then(function(event){
					self.clients = event.result;
					self.canGetMore = (self.clients.length < self.clients.$totalCount) ? true : false;
				});
			},

			getMore = function(){
				self.clients.$more().$promise.then(function(event){
					self.canGetMore = (self.clients.length < self.clients.$totalCount) ? true : false;
				});
			},

			edit = function (ID){
				self.goToState('clients.edit',{ID:ID});
			},

			remove = function (evt){
				alertify.confirm("Do you want to delete this clients?", function () {
				    sharedData.prepForBroadcast({"action":"removeClient","entity":evt.client});
				}, function() {
				    // user clicked "cancel"
				});
			},
			
			add = function () {
				self.goToState('clients.add');
			};

			self.getAll = getAll;
			self.getMore = getMore;
			self.edit = edit;
			self.remove = remove;
			self.add = add;

			self.getAll({orderBy:''});
		});
	};
	
	angular.module('workTime').controller('clientsController',clientsController);
	clientsController.$inject = ['$scope','$state','$wakanda','alertify','mySharedData'];
	
}(window.angular,window.moment,window.utils));