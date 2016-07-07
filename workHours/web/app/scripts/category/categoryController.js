/**
 * Category Controller
 */
(function(angular,moment,utils){
	'use strict';

	var categoryController = function($scope,$state,$wakanda,alertify,sharedData){
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
						self.getAll({orderBy:'clientName'});
					break;
				}

				if(typeof sharedData.message === 'object' && sharedData.message.action !== undefined){
					switch(sharedData.message.action){
						case 'loggedin':
							//self.getAllClients();
							//self.getAllCategories();
							self.loggedin = true;
							self.getAll({orderBy:'clientName'});
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
				ds.Category.$all(options).$promise.then(function(event){
					self.categories = event.result;
					self.canGetMore = (self.categories.length < self.categories.$totalCount) ? true : false;
				},function(err){
					sharedData.prepForBroadcast('logout');
				});
			},

			getMore = function(){
				self.categories.$more().$promise.then(function(event){
					self.canGetMore = (self.categories.length < self.categories.$totalCount) ? true : false;
				});
			},

			edit = function (ID){
				self.goToState('app.categories.edit',{ID:ID});
			},

			/**
			 * Remove a category
			 */
			remove = function(evt){
				var category = evt.category;
				alertify.confirm("Do you want to delete this category?", function () {
					// User click ok
					category.$remove().$promise.then(function () {
						alertify.success('Category removed!');
						self.getAll({orderBy:'clientName'});
					},function(err){
						sharedData.prepForBroadcast('logout');
					});
				}, function() {
				    // user clicked "cancel"
				});
			},

			add = function () {
				self.goToState('app.categories.add');
			};

			self.getAll = getAll;
			self.getMore = getMore;
			self.edit = edit;
			self.remove = remove;
			self.add = add;

			self.getAll({orderBy:'clientName'});
		});
	};

	angular.module('workTime').controller('categoryController',categoryController);
	categoryController.$inject = ['$scope','$state','$wakanda','alertify','mySharedData'];

}(window.angular,window.moment,window.utils));
