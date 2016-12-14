

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


model.User.events.remove = function(event) {
	if (this.allWorkTimes.length !== 0) {
		return {error: 32, errorMessage: 'This user have some worktimes, you cannot remove it.'};
	}
	if (this.allCategories.length !== 0) {
		return {error: 33, errorMessage: 'This user have some categories, you cannot remove it.'};
	}
};
