

model.WorkTime.events.save = function(event) {
	this.userID = currentSession().user.ID;
};
