

model.Category.categoryClient.onGet = function() {
	return this.name+' - '+this.clientName;
};


model.Category.events.restrict = function(event) {
	var returnCol = ds.Category.createEntityCollection();
	
	if (currentSession().belongsTo('DataAdmin')) {
		returnCol = ds.Category.all();
	} else {
		returnCol = ds.Category.query('allUsers.userID == :$userid');
	}
	
	return returnCol;
};


model.Category.events.remove = function(event) {
	if (this.allUsers.length !== 0) {
		return {error: 34, errorMessage: 'This category have some users, you cannot remove it.'};
	}
};
