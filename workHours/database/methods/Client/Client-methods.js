/**
 * This method is a generic method that will generate the report.
 * params : options is an object containing the from and to date and the client to generate report.
 * If there is no client, we do a report for all the client.
 * We can also pass 'all' ass clientName to get all the client
 * 
 * Params : object {from, to, clientName, userID}
 * 
 * Return an object containing : 
 * The time in minute for each categories
 * the price for each categories
 * the additional price for each categories
 * the train time for each categories
 * 
 * Also a Sub Total and a total
 * 
 * The subtotal separate the price and additional price and the total addition both price.
 * 
 * Each part have a label to display the category/client and total or subtotal.
 */
model.Client.methods.getReport = function (options) {
	var from,to,clientName,workTimes,returnArr,catObj,breakSum, categoryClientNames,i,subTotal,total;

	returnArr = [];
	catObj = {};
	subTotal = {'time':0,'price':0,'addPrice':0,'trainTime':0};
	total = {'time':0,'price':0,'addPrice':0,'trainTime':0};

	if(options === undefined || options.from === undefined || options.to === undefined){
		throw new Error('Must give a from and to date');
	} else if (options.userID === undefined) {
		throw new Error('You must provide an userID');
	} else {
		from = options.from;
		to = options.to;
		clientName = options.clientName || null;
		userID = options.userID;
		
		from = new Date(from);
		from.setHours(0);
		from.setMinutes(0);
		to = new Date(to);
		to.setHours(23);
		to.setMinutes(59);
	}
	
	if(clientName !== null && clientName !== 'all'){
		workTimes = ds.WorkTime.query('start > :1 and end < :2 and user.userID == :3 and clientName == :4',from,to,userID,clientName);
	}else{
		workTimes = ds.WorkTime.query('start > :1 and end < :2 and user.userID == :3',from,to,userID);
	}

	categoryClientNames = workTimes.distinctValues('categoryClient'); // List of all the categories
	

	categoryClientNames.forEach(function (categoryClient){
		var categoryClientName = categoryClient.replace(/\s|-/g, "");
		catObj[categoryClientName] = {'time':0,'price':0,'addPrice':0,'trainTime':0,'label':''};
	});
	
	workTimes.forEach(function (workTime){
		var categoryClientName = workTime.categoryClient.replace(/\s|-/g, ""), label;
		catObj[categoryClientName].time += (((workTime.end - workTime.start) - workTime.breakTimeMs)/1000/60); // Compute the time for each category in minute.
		catObj[categoryClientName].price += (((((workTime.end - workTime.start) + (workTime.trainTimeMs)) - workTime.breakTimeMs)/1000/60/60)*workTime.categoryPriceHour); // Compute the price for each category.
		catObj[categoryClientName].addPrice += workTime.trainPrice; // Compute the train price for each category .
		catObj[categoryClientName].trainTime += workTime.trainTimeMs/1000/60; // Compute the train time for each category in minute.
		
		label = (clientName !== null && clientName === 'all') ? workTime.categoryClient : workTime.categoryName;
		
		catObj[categoryClientName].label = label;
		
		// Calculate the total
		subTotal.time += (((workTime.end - workTime.start) - workTime.breakTimeMs)/1000/60);
		subTotal.price += (((((workTime.end - workTime.start) + (workTime.trainTimeMs)) - workTime.breakTimeMs)/1000/60/60)*workTime.categoryPriceHour);
		subTotal.addPrice += workTime.trainPrice;
		subTotal.trainTime += workTime.trainTimeMs/1000/60;
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