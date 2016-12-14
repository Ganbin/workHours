
/**
 * This method will create a new log
 * Param : log <object> : an object containing three attributes : type <string>, timestamp <date>, comment <string>
 */
model.Log.methods.newLog = function(log) {
	var res = {result: false, message: ''}
	try {
		if (log != null && log.type != null && log.timestamp != null && log.comment != null){
			var newLog = new ds.Log(log);
			newLog.save();
			res.result = true;
			res.message = 'New Log saved'
		} else {
			res.result = false;
			res.message = 'Missing arguments'
		}
	} catch (e) {
		res.message = e.message;
	}
	
	return res
};
