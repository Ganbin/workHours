/**
 * This service will be used to share data between our diferent controllers
 */
(function(angular){
	'use strict';
	
	angular.module('workTime')
	
	.factory('mySharedData', function($rootScope) {
		var sharedData = {},privateData={};

		sharedData.message = '';
		
		/**
		 * This method will set the message and send trigger the sent event
		 */
		sharedData.prepForBroadcast = function(msg) {
			this.message = msg;
			this.broadcastItem();
		};

		/**
		 * Method that will trigger the handleBroadcast event
		 * The event handler in our controllers will be run
		 */
		sharedData.broadcastItem = function() {
			$rootScope.$broadcast('handleBroadcast');
		};
		
		/**
		 * This method will set some private data to be reused by other controller
		 * params : attr : name of the attribute
		 * 			value : value of the attribute
		 */
		sharedData.setData = function(attr,value){
			privateData[attr] = value;
		};
		
		/**
		 * Get private data
		 * params : attr : name of the attribute
		 */
		sharedData.getData = function(attr){
			return (privateData.hasOwnProperty(attr)) ? privateData[attr] : false;
		};

		return sharedData;
	});
	
}(window.angular));