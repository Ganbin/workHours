

model.Category.entityMethods.addUser = function(userID) {
	var newCategoryUser = ds.CategoryUser.createEntity(), result = {res: false , message: ''};
	
	if (userID == null) {
		result.message = 'No user ID';
		return result;
	}
	
	try{
		
		if (ds.CategoryUser.find('category.ID == :1 and user.ID == :2', this.ID, userID) != null) {
			result.message = 'This relation already exist';
			return result
		}
		
		newCategoryUser.category = this;
		newCategoryUser.user = ds.User(userID);
	
		newCategoryUser.save();
		
		result.message = 'User assigned';
		result.res = true;
	} catch (e) {
		result.message = e.message;
	}
	
	return result;
};
model.Category.entityMethods.addUser.scope = 'public';

model.Category.entityMethods.removeUser = function(userID) {
	var relation, result = {res: false , message: ''};
	
	if (userID == null) {
		result.message = 'No user ID';
		return result;
	}
	
	relation = ds.CategoryUser.find('category.ID == :1 and user.ID == :2', this.ID, userID);
	
	try{
		
		if (relation == null) {
			result.message = 'This relation doesn\'t exist';
			return result
		}
		
		relation.remove()
		result.message = 'User removed';
		result.res = true;
		
	} catch (e) {
		result.message = e.message;
	}
	
	return result;
};
model.Category.entityMethods.removeUser.scope = 'public';