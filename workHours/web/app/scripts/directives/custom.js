(function(angular, moment, utils) {
	'use strict';

	angular.module('workTime')

	/* Attach to input time elements and switch their formatting to be HH:MM
	 */
	.directive('ngModel', function($filter) {
		return {
			require: '?ngModel',
			link: function(scope, elem, attr, ngModel) {
				if(!ngModel) {
					return;
				}
				if(attr.type !== 'time') {
					return;
				}

				ngModel.$formatters.unshift(function(value) {
					return value.replace(/:\d{2}[.,]\d{3}$/, ''); //
				});
			}
		};
	})
	.directive('datepicker', function() {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, element, attrs, ngModelCtrl) {
				var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
				if(!isChrome){
					var dateToSet = attrs.datepicker != '' && /\d{4}[-](0?[1-9]|1[012])[-](0[1-9]|[1-2][0-9]|3[01])/.test(attrs.datepicker) ? attrs.datepicker : new Date(); // Set the date of today if we don't get a date in the appropriate format (yyyy-mm-dd)
					$(element).datepicker({
						dateFormat: 'yy-mm-dd',
						onSelect: function(date) {
							scope.$apply(function() {
								//debugger;
								ngModelCtrl.$setViewValue(date);
							});
						}
					});
					setTimeout(function(){
						$(element).datepicker('setDate',dateToSet);
					},100);
				}
			}
		}
	});

}(window.angular, window.moment, window.utils));