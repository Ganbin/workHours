

model.WorkTime.events.save = function(event) {
	this.userID = currentSession().user.ID;
	this.modificationDate = new Date();
};


model.WorkTime.timeWorked.onGet = function() {
	var returnValue = 0,
		start = this.start,
		end = this.end;
		breakTime = this['break'];
		
	if(start != null && end != null){
		if(breakTime != null){
			returnValue = (end-start)-breakTime;
		}else{
			returnValue = (end-start);
		}
	}
	
	return returnValue;
};


model.WorkTime.userName.onGet = function() {
	var user = directory.internalStore.User.find('ID == :1',this.userID);
	return user.fullName || '';
};


model.WorkTime.events.init = function(event) {
	this.creationDate = new Date();
	this.modificationDate = new Date();
};
