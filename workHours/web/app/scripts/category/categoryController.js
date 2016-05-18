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
						self.getAll({orderBy:''});
					break;
				}

				if(typeof sharedData.message === 'object' && sharedData.message.action !== undefined){
					switch(sharedData.message.action){
						case 'removeCategory':
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
				ds.Category.$all(options).$promise.then(function(event){
					self.categories = event.result;
					self.canGetMore = (self.categories.length < self.categories.$totalCount) ? true : false;
				});
			},

			getMore = function(){
				self.categories.$more().$promise.then(function(event){
					self.canGetMore = (self.categories.length < self.categories.$totalCount) ? true : false;
				});
			},

			edit = function (ID){
				self.goToState('categories.edit',{ID:ID});
			},

			remove = function (evt){
				alertify.confirm("Do you want to delete this category?", function () {
				    sharedData.prepForBroadcast({"action":"removeCategory","entity":evt.category});
				}, function() {
				    // user clicked "cancel"
				});
			},
			
			add = function () {
				self.goToState('categories.add');
			};

			self.getAll = getAll;
			self.getMore = getMore;
			self.edit = edit;
			self.remove = remove;
			self.add = add;

			self.getAll({orderBy:''});
		});
	};
	
	angular.module('workTime').controller('categoryController',categoryController);
	categoryController.$inject = ['$scope','$state','$wakanda','alertify','mySharedData'];
	
}(window.angular,window.moment,window.utils));