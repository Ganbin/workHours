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
				var dataTmp,timeForChart=[],priceForChart=[],labelsForChart=[],dataTime,dataPrice,i;
				
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
						case 'report':
							dataTmp = sharedData.message.reportArr;
							for(i=0;i<dataTmp.length-2;i++){ // Loop through the reportArr, we don't check the 2 last one because their represent the total and subtotal
								timeForChart.push({name:dataTmp[i].label,y:dataTmp[i].time});
								priceForChart.push({name:dataTmp[i].label,y:dataTmp[i].price});
							}
							
							self.displayPieChart('.ct-chart-time',timeForChart,'Time for the client (in minutes)');
							self.displayPieChart('.ct-chart-price',priceForChart,'Price for the client (in CHF)');
						break;
					}
				}
			});

			var displayPieChart = function (elementID,data,title) {
				$(elementID).highcharts({
				//Highcharts.Chart(elementID,{	
					chart: {
						plotBackgroundColor: null,
						plotBorderWidth: null,
						plotShadow: false,
						type: 'pie'
					},
					title: {
						text: title
					},
					tooltip: {
						pointFormat: '{series.name}: <b>{point.y}</b>'
					},
					plotOptions: {
						pie: {
							allowPointSelect: true,
							cursor: 'pointer',
							dataLabels: {
								enabled: false
							},
							showInLegend: true
						}
					},
					series:[{
	                	name: 'Brands',
	                	colorByPoint: true,
	                	data:  data
	                }]
				});
			};

			/*var displayPieChart = function(elementID,data,options){
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

				new Chartist.Pie(elementID, data, options, responsiveOptions);
			};*/

			self.displayPieChart = displayPieChart;
			setTimeout(function(){
				//self.displayPieChart();
			},1000);
		});
	};
	
	angular.module('workTime').controller('reportGraphController',reportGraphController);
	reportGraphController.$inject = ['$scope','$state','$wakanda','alertify','mySharedData'];
	
}(window.angular,window.moment,window.utils));