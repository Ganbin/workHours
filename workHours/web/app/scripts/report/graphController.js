/**
 * Report Graph Controller
 */
(function(angular,moment,utils){
	'use strict';
	
	var reportGraphController = function($scope,$state,$wakanda,alertify,sharedData){
		var self = this;
		self.loggedin = sharedData.getData('logged') || false;
		self.goToState = $state.go;
		
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

				if(typeof sharedData.message === 'object' && sharedData.message.action !== undefined){
					switch(sharedData.message.action){
						case 'loggedin':
							self.loggedin = true;
						break;
					}
				}
			});

			var displayPieChart = function(options){
				var data = {
					  labels: ['Bananas', 'Apples', 'Grapes'],
					  series: [20, 15, 40]
					};

				var options = {
				  labelInterpolationFnc: function(value) {
				    return value[0]
				  }
				};

				var responsiveOptions = [
				  ['screen and (min-width: 640px)', {
				    chartPadding: 30,
				    labelOffset: 100,
				    labelDirection: 'explode',
				    labelInterpolationFnc: function(value) {
				      return value;
				    }
				  }],
				  ['screen and (min-width: 1024px)', {
				    labelOffset: 80,
				    chartPadding: 20
				  }]
				];

				new Chartist.Pie('.ct-chart', data, options, responsiveOptions);
			};

			self.displayPieChart = displayPieChart;
			
			//self.displayPieChart();
		});
	};
	
	angular.module('workTime').controller('reportGraphController',reportGraphController);
	reportGraphController.$inject = ['$scope','$state','$wakanda','alertify','mySharedData'];
	
}(window.angular,window.moment,window.utils));