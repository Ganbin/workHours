(function (angular, moment, utils) {
    'use strict';

    // Add minutesToHours filter, this filter will show the time in hours (hh:mm) from a value in minutes
    angular.module('workTime').filter('minutesToHours', function () {
        return function (minutes) {
            var date = (((Math.floor(minutes / 60)) < 10)
                ? ("0" + (Math.floor(minutes / 60)))
                : (Math.floor(minutes / 60))) + ':' + (((minutes % 60) < 10)
                ? ("0" + (minutes % 60))
                : (minutes % 60));
            return date;
        };
    });

    // Add millisToHours filter, this filter will show the time in hours (hh:mm) from a value in milliseconds
    angular.module('workTime').filter('millisToHours', function () {
        return function (millis) {
            var date, minutes = millis / 1000 / 60;
            date = (((Math.floor(millis / 60)) < 10)
                ? ("0" + (Math.floor(minutes / 60)))
                : (Math.floor(minutes / 60))) + ':' + (((minutes % 60) < 10)
                ? ("0" + (minutes % 60))
                : (minutes % 60));
            return date;
        };
    });

}(window.angular, window.moment, window.utils));
