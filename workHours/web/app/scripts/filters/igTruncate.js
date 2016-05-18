(function(angular, moment, utils) {
    'use strict';
    angular.module('igTruncate', []).filter('truncate', function() {
        return function(text, length, end) {
            if(text !== undefined && text !== null) {
                if(isNaN(length)) {
                    length = 10;
                }

                end = end || "...";

                if(text.length <= length || text.length - end.length <= length) {
                    return text;
                } else {
                    return String(text).substring(0, length - end.length) + end;
                }
            }
        };
    });
}(window.angular, window.moment, window.utils));