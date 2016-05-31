(function(angular,moment,utils){
	'use strict';

	var mainGridController = function($scope,$state,$wakanda,alertify,sharedData){
		var self = this,$state; // Why I put $state here?
		self.loggedin = sharedData.getData('logged') || false;
		self.toUTCDate = utils.toUTCDate;
		self.millisToUTCDate = utils.millisToUTCDate;
		self.goToState = $state.go;
		self.clientName = 'tout les clients';
		self.showDates = false;
		
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
						self.getAll({pageSize:self.workTimes.length+1,orderBy:'start desc'});
					break;
				}

				if(typeof sharedData.message === 'object' && sharedData.message.action !== undefined){
					switch(sharedData.message.action){
						case 'loggedin':
							self.loggedin = true;
							self.getAll({orderBy:'start desc'});
						break;
						case 'filter':
							self.workTimes = sharedData.message.result;
							self.clientName = sharedData.message.clientName || 'tout les clients';
							self.from = sharedData.message.from;
							self.to = sharedData.message.to;
							self.showDates = true;
						break;
					}
				}
			});

			var getAll = function(options){
				
				ds.UserTime.$all(options).$promise.then(function(event){
					self.workTimes = event.result;
					self.canGetMore = (self.workTimes.length < self.workTimes.$totalCount) ? true : false;
				},function(err){
					sharedData.prepForBroadcast('logout');
				});
			},

			getMore = function(){
				self.workTimes.$more().$promise.then(function(event){
					self.canGetMore = (self.workTimes.length < self.workTimes.$totalCount) ? true : false;
				},function(err){
					sharedData.prepForBroadcast('logout');
				});
			},

			editTime = function (ID){
				self.goToState('app.form.edit',{ID:ID});
			},

			removeTime = function (evt){
				alertify.confirm("Do you want to delete this item?", function () {
				    sharedData.prepForBroadcast({"action":"removeTime","entity":evt.workTime});
				}, function() {
				    // user clicked "cancel"
				});
			},
			
			addWorkTime = function () {
				self.goToState('app.form.add');
			};

			self.getAll = getAll;
			self.getMore = getMore;
			self.editTime = editTime;
			self.removeTime = removeTime;
			self.addWorkTime = addWorkTime;

			self.getAll({orderBy:'start desc'});
		});

	};

	angular.module('workTime').controller('mainGrid',mainGridController); // Add the controller to the workTime module
	mainGridController.$inject = ['$scope','$state','$wakanda','alertify','mySharedData']; // Inject dependencies

}(window.angular,window.moment,window.utils));
