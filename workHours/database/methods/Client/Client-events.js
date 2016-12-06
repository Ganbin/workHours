

model.Client.events.restrict = function(event) {
	var returnCol = ds.Client.createEntityCollection();
	
	if (currentSession().belongsTo('DataAdmin')) {
		returnCol = ds.Client.all();
	} else {
		returnCol = ds.Client.query('allCategories.allUsers.userID == :$userid');
	}
	
	return returnCol;
};
