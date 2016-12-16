
model.WorkTime.methods.getMine = function(options) {
	var res = {result: false, times: [], _count: 0}, resultTemp, start, pageSize, orderBy, i;

	if (options != null) {
		start = options.start || 0;
		pageSize = options.pageSize || 5;
		orderBy = options.orderBy || 'start desc';
	} else {
		start = 0;
		pageSize = 5;
		orderBy = 'start desc';
	}

	try {
		resultTemp = ds.WorkTime.query('user.userID == :$userid').orderBy(orderBy);
		res._count = resultTemp.length;
		
		for(i = start; i < start + pageSize; i++){
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