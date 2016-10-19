(function(angular,moment,utils){
	'use strict';

	var mainFormController = function($scope,$wakanda,alertify,sharedData,$stateParams){
		var self = this;
		self.loggedin = sharedData.getData('logged') || false;
		self.clients = sharedData.getData('allCients') || [];
		self.categories = sharedData.getData('allCategories') || [];
		self.title = 'Edit Work Time',
		self.disableCategory = true;
		
		self.ID = $stateParams.ID;

		self.endNow = function () {
			self.endAt = new Date();
		};

		self.setEntity = function(entity){
			
			var userOffsetBreak, userOffsetTrain, madate, madate2, breakTime = new Date(0), trainTime = new Date(0);
			
			self.entity = entity;
			self.edit = true;
			self.startDate = new Date(self.entity.start);
			self.startAt = new Date(self.entity.start);
			self.endDate = new Date(self.entity.end);
			self.endAt = new Date(self.entity.end);
			self.title = 'Edit Work Time';
		
			// Calculation of the offset to keep the duration from timestamp 0
			if(self.entity['break'] != null){
				userOffsetBreak = utils.checkDST(moment(self.entity['break']).tz('UTC')._d,true)*60000;
				madate = moment(self.entity['break']).tz('UTC');
				breakTime = new Date(Date.UTC(madate.toObject().years,madate.toObject().months,madate.toObject().date,madate.toObject().hours,madate.toObject().minutes,madate.toObject().seconds)+userOffsetBreak);
			}else{
				userOffsetBreak = utils.checkDST(moment(breakTime).tz('UTC')._d,true)*60000;
				madate = moment(breakTime).tz('UTC');
				breakTime = new Date(Date.UTC(madate.toObject().years,madate.toObject().months,madate.toObject().date,madate.toObject().hours,madate.toObject().minutes,madate.toObject().seconds)+userOffsetBreak);
			}
			
			if(self.entity.trainTime != null){
				userOffsetTrain = utils.checkDST(moment(self.entity.trainTime).tz('UTC')._d,true)*60000;
				madate2 = moment(self.entity.trainTime).tz('UTC');
				trainTime = new Date(Date.UTC(madate2.toObject().years,madate2.toObject().months,madate2.toObject().date,madate2.toObject().hours,madate2.toObject().minutes,madate2.toObject().seconds)+userOffsetTrain);
			}else{
				userOffsetTrain = utils.checkDST(moment(trainTime).tz('UTC')._d,true)*60000;
				madate2 = moment(trainTime).tz('UTC');
				trainTime = new Date(Date.UTC(madate2.toObject().years,madate2.toObject().months,madate2.toObject().date,madate2.toObject().hours,madate2.toObject().minutes,madate2.toObject().seconds)+userOffsetTrain);
			}
				
			self.breakTime = breakTime;//new Date(self.entity['break']);
			self.breakReason = self.entity.breakReason;
			self.trainTime = trainTime;
			self.trainPrice = self.entity.trainPrice;
			self.comment = self.entity.comment;
			self.entity.client.$fetch().$promise.then(function(evt){
				self.clientSelected = evt.result;
				self.getAllCategoriesFromClient(self.clientSelected.name);
				self.entity.category.$fetch().$promise.then(function(evt){
					self.categorySelected =  evt.result;
					self.disableCategory = false;
					//setTimeout(function(){$('.combobox').combobox()},100); // Delay of 100ms to avoid conflict when rendering the autocomplete combobox just after asign a value.
					
					// Activate the floatlabels
					$('.form-control').on('focus blur', function (e) {
					    $(this).parents('.form-group').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
					}).trigger('blur');
					
				});
			});
		};

		/**
		 * This method prepare the form when the user want to add a new worktime.
		 */
		self.setNewEntity = function(){
			self.startDate = new Date();
			self.endDate = new Date();
			self.startAt = new Date();
			self.endAt = new Date();
			self.breakTime = new Date(0,0);
			self.breakReason = '';
			self.trainTime = new Date(0,0);
			self.trainPrice = 0;
			self.comment = '';
			self.edit = false;
			self.title = 'Add Work Time';
			self.disableCategory = true;

			
			//$('.combobox').combobox();
			// Activate the floatlabels
			setTimeout(function(){
				$('.form-control').on('focus blur', function (e) {
				    $(this).parents('.form-group').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
				}).trigger('blur');
				
			},500);
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
						case 'removeTime':
							self.removeTime(sharedData.message.entity);
						break;
						case 'loggedin':
							self.getAllClients();
							//self.getAllCategories();
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
			 * This method save a new worktime.
			 */
			var saveTime = function(){
				//debugger;
				var startDateTmp = moment(this.startDate),
					startAtTmp = moment(this.startAt),
					endDateTmp = moment(this.endDate),
					endAtTmp = moment(this.endAt),
					newTime = ds.WorkTime.$create();

				newTime.start = moment(startDateTmp.format('YYYYMMDD')+'T'+startAtTmp.format('HHmm')).toDate();
				newTime.end = moment(endDateTmp.format('YYYYMMDD')+'T'+endAtTmp.format('HHmm')).toDate();
				//newTime['break'] = this.breakTime != null && this.breakTime.getTime()-(1000*(this.breakTime.getTimezoneOffset())*60); // To get the number of ms without having to care about the timezone.
				newTime['break'] = this.breakTime != null ? (this.breakTime.getHours()*60*60*1000)+(this.breakTime.getMinutes()*60*1000) : 0;
				newTime.breakReason = this.breakReason;
				//debugger;
				//newTime.trainTime = this.trainTime != null && this.trainTime.getTime()-(1000*(this.trainTime.getTimezoneOffset())*60); // To get the number of ms without having to care about the timezone.
				newTime.trainTime = this.trainTime != null ? (this.trainTime.getHours()*60*60*1000)+(this.trainTime.getMinutes()*60*1000) : 0;
				newTime.trainPrice = this.trainPrice;
				newTime.comment = this.comment;

				newTime.client = utils.map(this.clients)[this.clientSelected.ID];//utils.findInArray(this.clients,this.clientSelected,'name',true);
				newTime.category = utils.map(this.categories)[this.categorySelected.ID];//utils.findInArray(this.categories,this.categorySelected,'name',true);
				newTime.$save().$promise.then(function(){
					sharedData.prepForBroadcast('saved');
					alertify.success('New Time Saved!');
					self.setNewEntity();
				});
			},

			/**
			 * This method do the actions to edit and save a worktime.
			 */
			editTime = function(form){
				var startDateTmp = moment(this.startDate),
					startAtTmp = moment(this.startAt),
					endDateTmp = moment(this.endDate),
					endAtTmp = moment(this.endAt),
					editTime = self.entity;


				editTime.start = moment(startDateTmp.format('YYYYMMDD')+'T'+startAtTmp.format('HHmm')).toDate();
				editTime.end = moment(endDateTmp.format('YYYYMMDD')+'T'+endAtTmp.format('HHmm')).toDate();
				//editTime['break'] = (this.breakTime != null) && this.breakTime.getTime()-(1000*(this.breakTime.getTimezoneOffset())*60); // To get the number of ms without having to care about the timezone.
				editTime['break'] = this.breakTime != null ? (this.breakTime.getHours()*60*60*1000)+(this.breakTime.getMinutes()*60*1000) : 0;
				editTime.breakReason = this.breakReason;
				editTime.comment = this.comment;

				//editTime.trainTime = this.trainTime != null && this.trainTime.getTime()-(1000*(this.trainTime.getTimezoneOffset())*60); // To get the number of ms without having to care about the timezone.
				editTime.trainTime = this.trainTime != null ? (this.trainTime.getHours()*60*60*1000)+(this.trainTime.getMinutes()*60*1000) : 0;
				editTime.trainPrice = this.trainPrice;

				editTime.client = utils.map(this.clients)[this.clientSelected.ID];
				editTime.category = utils.map(this.categories)[this.categorySelected.ID];
				editTime.$save().$promise.then(function(){
					sharedData.prepForBroadcast('saved');
					alertify.success('Time Edited!');
				});
			},

			/**
			 * Remove a worktime
			 */
			removeTime = function(entity){
				entity.$remove().$promise.then(function () {
					sharedData.prepForBroadcast('saved');
					alertify.success('Time removed!');
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

			// get all Categories
			// Not used because now I restrict the list according to the client choosen.
			getAllCategories = function(){
				ds.Category.$all().$promise.then(function(evt){
					self.categories = evt.result;
					sharedData.setData('allCategories',self.categories);
				});
			},

			// get all Categories of the client selected
			getAllCategoriesFromClient = function(clientName){
				ds.Category.$query({filter:'clientName == :1',params:[clientName]}).$promise.then(function(evt){
					self.categories = evt.result;
					self.disableCategory = false;
					sharedData.setData('allCategories',self.categories);
				});
			},

			getEntity = function(){
				ds.WorkTime.$find(self.ID).$promise.then(function(evt){
					self.setEntity(evt.result);
				});
			};

			self.clientChange = function (evt){
				//debugger;
				self.getAllCategoriesFromClient(self.clientSelected.name);
			};

			self.saveTime = saveTime;
			self.editTime = editTime;
			self.removeTime = removeTime;
			self.getAllClients = getAllClients;
			self.getAllCategories = getAllCategories;
			self.getAllCategoriesFromClient = getAllCategoriesFromClient;
			self.getEntity = getEntity;

			// If not params, I set the form as a new entity to add
			if(self.ID !== '' && self.ID !== undefined){
				getEntity(self.ID);
			}else{
				self.setNewEntity();
				
			}

			if(self.categories.length === 0){
				//getAllCategories();
				getAllClients();
			}
		});

	};

	angular.module('workTime').controller('mainForm',mainFormController);
	mainFormController.$inject = ['$scope','$wakanda','alertify','mySharedData','$stateParams'];

}(window.angular,window.moment,window.utils));
