

model.User.fullName.onGet = function() {
	return this.firstName+" "+this.lastName;
};
