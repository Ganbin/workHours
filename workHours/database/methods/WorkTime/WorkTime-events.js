model.WorkTime.events.save = function(event) {
	var user;
	if (this.userID == null || !currentSession().belongsTo('dataAdmin')) {
		user = ds.User.find('userID == :1', currentSession().user.ID);
		if (user == null) {
			return {error: 14, errorMessage: 'Your user doesn\'t exist in the database, please look with an dataAdmin'};
		}
		this.user = user;
	}
	this.modificationDate = new Date();
};

model.WorkTime.timeWorked.onGet = function() {
	var returnValue = 0,
		start = this.start,
		end = this.end;
		breakTime = this.breakTimeMs;

	if(start != null && end != null){
		if(breakTime != null || breakTime != 0){
			returnValue = (end-start)-breakTime;
		}else{
			returnValue = (end-start);
		}
	}

	return returnValue;
};

// Deprecated we use now the user attribute to get the full name
//model.WorkTime.userName.onGet = function() {
//	var user = directory.internalStore.User.find('ID == :1',this.userID);
//	return user.fullName || '';
//};

model.WorkTime.events.init = function(event) {
	this.creationDate = new Date();
	this.modificationDate = new Date();
};

model.WorkTime.events.validate = function(event) {
	if(this.isNew() && (((this.breakTime != null) && this.breakReason == null) || (this.breakReason != null && (this.breakTime == null)))){
		return {error: 10, errorMessage: 'You must have a reason for a break time!'};
	}

	if(this.isNew() && (this.trainTime != null && this.trainPrice == null) || (this.trainPrice != null && this.trainTime == null)){
		return {error: 11, errorMessage: 'You must have a price with a train time!'};
	}
};

model.WorkTime.breakTime.events.validate = function(event) {
	if(this.breakTime != null && !this.breakTime.match(/([01]{1}[0-9]|2[0-3]):[0-5][0-9]/)){
		return {error: 12, errorMessage: 'The breakTime attribute must be an hours between 00:00 - 23:59'}
	}
};

model.WorkTime.trainTime.events.validate = function(event) {
	if (this.trainTime != null && !this.trainTime.match(/([01]{1}[0-9]|2[0-3]):[0-5][0-9]/)){
		return {error: 13, errorMessage: 'The trainTime attribute must be an hours between 00:00 - 23:59'}
	}
};

model.WorkTime.breakTimeMs.onGet = function() {
	if (this.breakTime != null) {
		return ((parseInt(this.breakTime.substr(0,2))*60)+parseInt(this.breakTime.substr(3,2)))*60*1000;
	}

	return 0;
};

model.WorkTime.trainTimeMs.onGet = function() {
	if (this.trainTime != null) {
		return ((parseInt(this.trainTime.substr(0,2))*60)+parseInt(this.trainTime.substr(3,2)))*60*1000;
	}
	return 0;
};


model.WorkTime.events.restrict = function(event) {
  var returnCol = ds.WorkTime.createEntityCollection();

	if (currentSession().belongsTo('DataAdmin')) {
    returnCol = ds.WorkTime.all();
	} else {
		returnCol = ds.WorkTime.query('user.userID == :$userid');
		returnCol.add(ds.WorkTime.query('userID == :$userid')); // This is to keep backward compatibility but should be remove when the userID of worktime is removed after convertion
	}

	return returnCol;
};
