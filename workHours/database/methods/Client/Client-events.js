

model.Client.events.restrict = function(event) {
	var returnCol = ds.Client.createEntityCollection();
	
	if (currentSession().belongsTo('DataAdmin')) {
		returnCol = ds.Client.all();
	} else {
		returnCol = ds.Client.query('allCategories.allUsers.userID == :$userid');
	}
	
	return returnCol;
};


model.Client.events.remove = function(event) {
	if (this.allCategories.length !== 0) {
		return {error: 31, errorMessage: 'This client have some categories, you cannot remove it.'};
	}
};
