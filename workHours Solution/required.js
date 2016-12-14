// Custom login listener
function customLoginListener(login, password) {
    "use strict";

	ds.Log.newLog({
		type: 'Login',
		timestamp: new Date(),
		comment: login + ' just try to get logged.'
	}); 

	return false;
}