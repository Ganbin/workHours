// Custom login listener
function customLoginListener(login, password) {
    "use strict";

	if (login === 'admin'){
		return false
	}

	var res = ds.Log.newLog({
		type: 'Login',
		timestamp: new Date(),
		comment: login + ' just try to get logged.'
	});

	console.log('Login Listener res: ' + res.message);

	return false;
}