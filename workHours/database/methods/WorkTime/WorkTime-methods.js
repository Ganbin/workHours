
model.WorkTime.methods.getMine = function(options) {
	var res = {result: false, times: [], _count: 0}, resultTemp, start, pageSize, orderBy, all, resultLength, i;

	if (options != null) {
		start = options.start || 0;
		pageSize = options.pageSize || 5;
		orderBy = options.orderBy || 'start desc';
		all = options.all || false;
	} else {
		start = 0;
		pageSize = 5;
		orderBy = 'start desc';
	}
	
	try {
		resultTemp = ds.WorkTime.query('user.userID == :$userid').orderBy(orderBy);
		res._count = resultTemp.length;
		
		if (all) {
			resultLength = resultTemp.length
		} else {
			resultLength = start + pageSize;
		}
		for(i = start; i < resultLength; i++){
			if (resultTemp[i] == null ){
				break;
			}
			res.times.push(resultTemp[i]);
		}
		res.result = true;
	} catch (e) {
	}
	return res;
};
model.WorkTime.methods.getMine.scope = 'public';

model.WorkTime.methods.getFiltered = function(options) {
	var res = {result: false, times: [], _count: 0}, from, to, clientName, userID, resultTemp, start, pageSize, orderBy, all, resultLength, i;
	
	if(options === undefined || options.from === undefined || options.to === undefined){
		throw new Error('Must give a from and to date');
	} else if (options.userID === undefined) {
		throw new Error('You must provide an userID');
	} else {
		from = options.from;
		to = options.to;
		clientName = options.clientName || null;
		userID = options.userID;
		all = options.all || false;
		
		from = new Date(from);
		from.setHours(0);
		from.setMinutes(0);
		to = new Date(to);
		to.setHours(23);
		to.setMinutes(59);
	}
	
	if (options != null) {
		params = options.params;
		start = options.start || 0;
		pageSize = options.pageSize || 5;
		orderBy = options.orderBy || 'start desc';
	} else {
		start = 0;
		pageSize = 5;
		orderBy = 'start desc';
	}

	try {
		if(clientName !== null && clientName !== 'all'){
			resultTemp = ds.WorkTime.query('start > :1 and end < :2 and user.userID == :3 and clientName == :4',from,to,userID,clientName).orderBy(orderBy);
		}else{
			resultTemp = ds.WorkTime.query('start > :1 and end < :2 and user.userID == :3',from,to,userID).orderBy(orderBy);
		}
		res._count = resultTemp.length;
				
		if (all) {
			resultLength = resultTemp.length
		} else {
			resultLength = start + pageSize;
		}
		
		for(i = start; i < resultLength; i++){
			if (resultTemp[i] == null ){
				break;
			}
			res.times.push(resultTemp[i]);
		}
		res.result = true;
	} catch (e) {
	}
	return res;
};
model.WorkTime.methods.getFiltered.scope = 'public';