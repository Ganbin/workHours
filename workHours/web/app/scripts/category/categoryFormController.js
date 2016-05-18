(function(angular,moment,utils){
	'use strict';

	var categoryFormController = function($scope,$wakanda,alertify,sharedData,$stateParams){
		var self = this;
		self.loggedin = sharedData.getData('logged') || false;
		self.clients = sharedData.getData('allCients') || [];
		self.title = 'Edit Category';

		self.ID = $stateParams.ID;

		self.setEntity = function(entity){
			self.entity = entity;
			self.editBtn = true;
			self.name = self.entity.name;
			self.priceHour = self.entity.priceHour;
			// CATEGORY
			self.entity.client.$fetch().$promise.then(function(evt){
				self.clientSelected =  evt.result;
			});
			self.title = 'Edit Category';
		};

		/**
		 * This method prepare the form when the user want to add a new worktime.
		 */
		self.setNewEntity = function(){
			self.name = '';
			self.priceHour = 0;
			self.editBtn = false;
			self.title = 'Add Category';
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
						case 'removeCategory':
							self.remove(sharedData.message.entity);
						break;
						case 'loggedin':
							self.getAllClients();
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
				var newCategory = ds.Category.$create();

				newCategory.name = this.name;
				newCategory.priceHour = this.priceHour;
				newCategory.client = utils.map(self.clients)[self.clientSelected.ID];
				
				newCategory.$save().$promise.then(function(){
					sharedData.prepForBroadcast('saved');
					alertify.success('New Category Saved!');
				})
			},

			/**
			 * This method do the actions to edit a client.
			 */
			edit = function(){
				var editCategory = self.entity;

				editCategory.name = this.name;
				editCategory.priceHour = this.priceHour;
				editCategory.client = utils.map(self.clients)[self.clientSelected.ID];
				
				editCategory.$save().$promise.then(function(){
					sharedData.prepForBroadcast('saved');
					alertify.success('New Client Saved!');
				});
			},

			/**
			 * Remove a client
			 */
			remove = function(entity){
				entity.$remove().$promise.then(function () {
					sharedData.prepForBroadcast('saved');
					alertify.success('Client removed!');
				});
			},

			// get all Clients
			getAllClients = function(){
				ds.Client.$all().$promise.then(function(evt){
					self.clients = evt.result;
					sharedData.setData('allCients',self.clients);
				});
			},

			getEntity = function(){
				ds.Category.$find(self.ID).$promise.then(function(evt){
					self.setEntity(evt.result);
				});
			};

			// If not params, I set the form as a new entity to add
			if(self.ID !== '' && self.ID !== undefined){
				getEntity(self.ID);
			}else{
				self.setNewEntity();
			}
			
			if(self.clients.length === 0){
				getAllClients();
			}

			self.save = save;
			self.edit = edit;
			self.remove = remove;
			self.getAllClients = getAllClients;
			self.getEntity = getEntity;

		});

	};

	angular.module('workTime').controller('categoryForm',categoryFormController);
	categoryFormController.$inject = ['$scope','$wakanda','alertify','mySharedData','$stateParams'];


}(window.angular,window.moment,window.utils));
