/**
 * 
 */
(function(angular){
	'use strict';
	
	angular.module('workTime')
	
	.service('Session', function () {
		this.create = function (userID, userName, userFullName) {
			this.userID = userID;
			this.userName = userName;
			this.userFullName = userFullName;
		};
		this.destroy = function () {
			this.userID = null;
			this.userName = null;
			this.userFullName = null;
		};
	});
	
}(window.angular));