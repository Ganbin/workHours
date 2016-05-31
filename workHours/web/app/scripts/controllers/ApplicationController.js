(function(angular,moment,utils){
	'use strict';
	
	var ApplicationController = function ($scope, AuthService) {
		var self = this;
		self.currentUser = null;
		self.isAuthenticated = AuthService.isAuthenticated();

		self.setCurrentUser = function (user) {
			self.currentUser = user;
		};
	};
	
	angular.module('workTime').controller('ApplicationController', ApplicationController);
	ApplicationController.$inject = ['$scope','AuthService'];

	
}(window.angular,window.moment,window.utils));