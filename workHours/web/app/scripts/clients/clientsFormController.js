(function(angular,moment,utils){
	'use strict';

	var clientsFormController = function($scope,$wakanda,alertify,sharedData,$stateParams){
		var self = this;
		self.loggedin = sharedData.getData('logged') || false;
		self.title = 'Edit Client';

		self.ID = $stateParams.ID;

		self.setEntity = function(entity){
			self.entity = entity;
			self.editBtn = true;
			self.name = self.entity.name;
			self.title = 'Edit Client';
		};

		/**
		 * This method prepare the form when the user want to add a new worktime.
		 */
		self.setNewEntity = function(){
			self.name = '';
			self.editBtn = false;
			self.title = 'Add Client';
		};

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

				if(typeof sharedData.message === 'object' && sharedData.message.action != null){
					switch(sharedData.message.action){
						case 'removeClient':
							self.remove(sharedData.message.entity);
						break;
						case 'loggedin':
							//self.getAllClients();
							self.loggedin = true;
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

			/**
			 * This method save a new client.
			 */
			var save = function(){
				//debugger;
				var newClient = ds.Client.$create();

				newClient.name = this.name;

				newClient.$save().$promise.then(function(){
					sharedData.prepForBroadcast('saved');
					self.name = '';
					alertify.success('New Client Saved!');
				},function(err){
					sharedData.prepForBroadcast('logout');
				})
			},

			/**
			 * This method do the actions to edit a client.
			 */
			edit = function(){
				var editClient = self.entity;

				editClient.name = this.name;

				editClient.$save().$promise.then(function(){
					sharedData.prepForBroadcast('saved');
					alertify.success('New Client Saved!');
				},function(err){
					sharedData.prepForBroadcast('logout');
				});
			},

			/**
			 * Remove a client
			 */
			remove = function(entity){
				entity.$remove().$promise.then(function () {
					sharedData.prepForBroadcast('saved');
					alertify.success('Client removed!');
				},function(err){
					sharedData.prepForBroadcast('logout');
				});
			},

			// get all Clients
			getAllClients = function(){
				ds.Client.$all().$promise.then(function(evt){
					self.clients = evt.result;
					sharedData.setData('allCients',self.clients);
				},function(err){
					sharedData.prepForBroadcast('logout');
				});
			},

			getEntity = function(){
				ds.Client.$find(self.ID).$promise.then(function(evt){
					self.setEntity(evt.result);
				},function(err){
					sharedData.prepForBroadcast('logout');
				});
			};

			// If not params, I set the form as a new entity to add
			if(self.ID !== '' && self.ID !== undefined){
				getEntity(self.ID);
			}else{
				self.setNewEntity();
			}


			self.save = save;
			self.edit = edit;
			self.remove = remove;
			self.getAllClients = getAllClients;
			self.getEntity = getEntity;

		});

	};

	angular.module('workTime').controller('clientsForm',clientsFormController);
	clientsFormController.$inject = ['$scope','$wakanda','alertify','mySharedData','$stateParams'];


}(window.angular,window.moment,window.utils));
