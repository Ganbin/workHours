/**
 * This method is a generic method that will generate the report.
 * params : options is an object containing the from and to date and the client to generate report.
 * If there is no client, we do a report for all the client.
 */
model.Client.methods.getReport = function (options) {
	var from,to,clientName,workTimes,returnArr,catObj,breakSum,categoryNames,i,subTotal,total;
//debugger;
	returnArr = [];
	catObj = {};
	subTotal = {'time':0,'price':0,'addPrice':0,'trainTime':0};
	total = {'time':0,'price':0,'addPrice':0,'trainTime':0};

	if(options === undefined || options.from === undefined || options.to === undefined){
		throw new Error('Must give a from and to date');
	}else{
		from = options.from;
		to = options.to;
		clientName = options.clientName || null;
		userID = options.userID;
		
		from = new Date(from/*.substr(0,from.length-10)*/);
		from.setHours(0);
		from.setMinutes(0);
		to = new Date(to/*.substr(0,to.length-10)*/);
		to.setHours(23);
		to.setMinutes(59);
	}
	
	if(clientName !== null){
		workTimes = ds.WorkTime.query('start > :1 and end < :2 and userID == :3 and clientName == :4',from,to,userID,clientName);
	}else{
		workTimes = ds.WorkTime.query('start > :1 and end < :2 and userID == :3',from,to,userID);
	}

	categoryClientNames = workTimes.distinctValues('categoryClient'); // List of all the categories
	categoryNames = workTimes.distinctValues('categoryName'); // List of all the categories
	//breakSum = workTimes.compute('break','categoryName').toArray({'break':{sum:true}}); // Sum of the break for each category
//debugger;
	i=0;
	categoryNames.forEach(function (category){
		catObj[category] = {'time':0,'price':0,'addPrice':0,'trainTime':0,'label':''};
		//debugger;
		returnArr[i] = {'name':category}; // Create the return array with each category
		i+=1;
	});
	
	workTimes.forEach(function (workTime){
		catObj[workTime.categoryName].time += (((workTime.end - workTime.start) - workTime['break'])/1000/60); // Compute the time for each category in minute.
		catObj[workTime.categoryName].price += (((((workTime.end - workTime.start) + (workTime.trainTime)) - workTime['break'])/1000/60/60)*workTime.categoryPriceHour); // Compute the price for each category.
		catObj[workTime.categoryName].addPrice += workTime.trainPrice; // Compute the train price for each category .
		catObj[workTime.categoryName].trainTime += workTime.trainTime/1000/60; // Compute the train time for each category in minute.
		catObj[workTime.categoryName].label = workTime.categoryClient;
		
		// Calculate the total
		subTotal.time += (((workTime.end - workTime.start) - workTime['break'])/1000/60); // Compute the time for each category in minute.
		subTotal.price += (((((workTime.end - workTime.start) + (workTime.trainTime)) - workTime['break'])/1000/60/60)*workTime.categoryPriceHour); // Compute the price for each category.
		subTotal.addPrice += workTime.trainPrice; // Compute the train price for each category .
		subTotal.trainTime += workTime.trainTime/1000/60; // Compute the train time for each category in minute.
	});
	
	total.price = subTotal.price+subTotal.addPrice;
	total.time = subTotal.time;
	total.trainTime = subTotal.trainTime;
	total.label = 'Total';
	subTotal.label = 'Sub Total';
	
	catObj.SubTotal = subTotal;
	catObj.Total = total;
	
	return catObj;
};
model.Client.methods.getReport.scope = "public";