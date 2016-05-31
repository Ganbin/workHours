(function(angular){
	'use strict';

	angular.module('workTime', ['wakanda','ngAlertify','igTruncate','ui.router']);
	
	angular.module('workTime').constant('AUTH_EVENTS',{
		loginSuccess: 'auth-login-success',
		loginFailed: 'auth-login-failed',
		logoutSuccess: 'auth-logout-success',
		sessionTimeout: 'auth-session-timeout',
		notAuthenticated: 'auth-not-authenticated',
		notAuthorized: 'auth-not-authorized'
	});

}(window.angular));
