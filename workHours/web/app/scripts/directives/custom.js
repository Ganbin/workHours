(function(angular,moment,utils){
	'use strict';
	
	angular.module('workTime')
	
	/* Attach to input time elements and switch their formatting to be HH:MM
	 */             
	.directive('ngModel', function( $filter ) {
	    return {
	        require: '?ngModel',
	        link: function(scope, elem, attr, ngModel) {
	            if( !ngModel ){
	                return;
	            }
	            if( attr.type !== 'time' ){
	                return;
	            }
	                    
	            ngModel.$formatters.unshift(function(value) {
	                return value.replace(/:\d{2}[.,]\d{3}$/, '');//
	            });
	        }
	    };
	});
	
}(window.angular,window.moment,window.utils));