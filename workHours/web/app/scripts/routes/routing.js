(function (angular){
	'use strict';

	var routes = function($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise('/home');

		$stateProvider

		.state('app',{
			abstract: true,
			template:'<div ui-view></div>',
			resolve:{
				AuthService: function (AuthService) {
					//debugger;
					return AuthService.promise;
				}
			}
		})

		.state('app.home', {
			url: '/home',
			templateUrl: 'views/home.html',
			controller:'homeController',
			controllerAs:'homeCtrl'
		})

		.state('app.form', {
			url: '/form',
			templateUrl:'views/form-grid.html',
			controller:'mainGrid',
			controllerAs:'gridCtrl',
			views:{
				'':{
					templateUrl:'views/form-grid.html',
					controller:'mainGrid',
					controllerAs:'gridCtrl'
				},
				'filters@':{
					templateUrl:'scripts/worktimes/filters.html',
					controller:'workTimeFiltersController',
					controllerAs:'filterCtrl'
				}
			}
		}).state('app.form.edit',{
			url: '/edit/:ID',
			views:{
				'form@':{
					templateUrl:'views/form.html',
					controller:'mainForm',
					controllerAs:'formCtrl'
				}
			}
		}).state('app.form.add',{
			url: '/add',
			views:{
				'form@':{
					templateUrl:'views/form.html',
					controller:'mainForm',
					controllerAs:'formCtrl'
				}
			}
		}).state('app.clients', {
			url: '/clients',
			templateUrl:'scripts/clients/clients.html',
			controller:'clientsController',
			controllerAs:'clientsCtrl'
		}).state('app.clients.edit',{
			url: '/edit/:ID',
			views:{
				'form@':{
					templateUrl:'scripts/clients/clientForm.html',
					controller:'clientsForm',
					controllerAs:'clientsForm'
				}
			}
		}).state('app.clients.add',{
			url: '/add',
			views:{
				'form@':{
					templateUrl:'scripts/clients/clientForm.html',
					controller:'clientsForm',
					controllerAs:'clientsForm'
				}
			}
		}).state('app.categories', {
			url: '/categories',
			templateUrl:'scripts/category/grid.html',
			controller:'categoryController',
			controllerAs:'categoryCtrl'
		}).state('app.categories.edit',{
			url: '/edit/:ID',
			views:{
				'form@':{
					templateUrl:'scripts/category/form.html',
					controller:'categoryForm',
					controllerAs:'categoryForm'
				}
			}
		}).state('app.categories.add',{
			url: '/add',
			views:{
				'form@':{
					templateUrl:'scripts/category/form.html',
					controller:'categoryForm',
					controllerAs:'categoryForm'
				}
			}
		}).state('app.report',{
			url:"/report",
			views: {
				'filters@': {
					templateUrl: 'scripts/report/report-filters.html',
					controller: "reportFilterController",
					controllerAs:'filterCtrl'
				},
				'tabledata@': {
					templateUrl: 'scripts/report/report-table.html',
					controller: "reportTableController",
					controllerAs:'tableCtrl'
				},
				'graph@': {
					templateUrl: 'scripts/report/report-graph.html',
					controller: "reportGraphController",
					controllerAs:'graphCtrl'
				}
			}
		});
	};

	angular.module('workTime').config(routes);
	routes.$inject = ['$stateProvider','$urlRouterProvider'];
}(window.angular));
