(function(angular, moment, utils) {
    'use strict';
    
    // Add minutesToHours filter, this filter will show the time in hours (hh:mm) from a value in minutes
    angular.module('workTime').filter('minutesToHours', function() {
		return function (minutes){
			var date = (((Math.round(minutes/60)) < 10) ? ("0" + (Math.round(minutes/60))) : (Math.round(minutes/60))) + ':' + (((minutes%60) < 10) ? ("0" + (minutes%60)) : (minutes%60));
			return date;
		};
	});
    
}(window.angular, window.moment, window.utils));