(function(angular,moment,utils){
	'use strict';

	var mainGridController = function($scope,$state,$wakanda,alertify,sharedData,Session){
		var self = this,$state; // Why I put $state here?
		self.loggedin = sharedData.getData('logged') || false;
		self.toUTCDate = utils.toUTCDate;
		self.millisToUTCDate = utils.millisToUTCDate;
		self.goToState = $state.go;
		self.clientName = 'tous les clients';
		self.showDates = false;
		self.showUser = false;
		self.userName = Session.userFullName;
		self.formLoaded = $state.current.url === '/form' ? false : true;
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
					case 'EnterWorktimeForm':
						self.formLoaded = true;
					break;
					case 'ExitWorktimeForm':
						self.formLoaded = false;
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
							sharedData.setData('workTimes',self.workTimes);
							self.clientName = sharedData.message.clientName || 'tous les clients';
							self.userName = sharedData.message.userName === '*' ? 'tous les utilisateurs' : sharedData.message.userName || Session.fullName;
							self.from = sharedData.message.from;
							self.to = sharedData.message.to;
							self.showDates = true;
							self.showUser = sharedData.message.showUser || false;
							self.canGetMore = (self.workTimes.length < self.workTimes.$totalCount) ? true : false;
							sharedData.setData('loadUserTime',false);
						break;
					}
				}
			});

			var getAll = function(options){
				ds.UserTime.$all(options).$promise.then(function(evt){
					self.workTimes = evt.result;
					
					self.collValueNow = evt.result.length;
					self.collValueMax = evt.result.$totalCount;
					self.collValuePercent = Math.round((self.collValueNow/self.collValueMax)*100);
					
					sharedData.setData('workTimes',self.workTimes);
					self.canGetMore = (self.workTimes.length < self.workTimes.$totalCount) ? true : false;
				},function(err){
					sharedData.prepForBroadcast('logout');
				});
			},

			getMore = function(){
				self.workTimes.$more().$promise.then(function(evt){
					self.collValueNow = evt.result.length;
					self.collValueMax = evt.result.$totalCount;
					self.collValuePercent = Math.round((self.collValueNow/self.collValueMax)*100);
					self.canGetMore = (self.workTimes.length < self.workTimes.$totalCount) ? true : false;
				},function(err){
					sharedData.prepForBroadcast('logout');
				});
			},

			editTime = function (ID){
				self.goToState('app.form.edit',{ID:ID});
				self.formLoaded = true;
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
				self.formLoaded = true;
			};

			self.getAll = getAll;
			self.getMore = getMore;
			self.editTime = editTime;
			self.removeTime = removeTime;
			self.addWorkTime = addWorkTime;

			if(sharedData.getData('loadUserTime') === false){
				self.getAll({orderBy:'start desc',pageSize:10});
				sharedData.setData('loadUserTime',true);
			} else {
				self.workTimes = sharedData.getData('workTimes');
			}
		});

	};

	angular.module('workTime').controller('mainGrid',mainGridController); // Add the controller to the workTime module
	mainGridController.$inject = ['$scope','$state','$wakanda','alertify','mySharedData','Session']; // Inject dependencies

}(window.angular,window.moment,window.utils));
