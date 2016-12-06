
model.Utility.methods.getUserNames = function() {
	var returnArr = [];
	
	directory.internalStore.User.all().forEach(function (user) {
		returnArr.push({'name':user.fullName,'ID':user.ID});
	});
	
	return returnArr;
};
model.Utility.methods.getUserNames.scope = 'publicOnServer';