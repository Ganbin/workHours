

model.User.fullName.onGet = function() {
	return this.firstName+" "+this.lastName;
};


model.User.events.restrict = function(event) {
	var returnCol = ds.User.createEntityCollection();
	
	if (currentSession().belongsTo('DataAdmin')) {
		returnCol = ds.User.all();
	} else {
		returnCol = ds.User.query('userID == :$userid');
	}
	
	return returnCol;
};
