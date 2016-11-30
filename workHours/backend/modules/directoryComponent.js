/*************************************************************
 *	Created by vegar ringdal, nov 2012						 *
 *  This can be used for free for anything                   *                                       *
 *************************************************************/





/*************************************************************
 *	check if user in Admin group							 *
 *************************************************************/
exports.userHaveAccess = function userHaveAccess() {
	var session = currentSession();
	return isIn = (session.belongsTo("Admin") || session.belongsTo("DataAdmin"));
};





/*************************************************************
 *	Get users												 *
 *************************************************************/
exports.getUsers = function getUsers() {
	if(exports.userHaveAccess()!==true){
		return null;
	}
    return directory.internalStore.User.all().toArray("ID,name,fullName");
};





/*************************************************************
 *	Get users groups										 *
 *************************************************************/
exports.getUsersGroups = function getUsersGroups(id) {
	if(exports.userHaveAccess()!==true){
		return null;
	}
    try {
        var user = directory.internalStore.Usergroup.query("user.ID = :1", id);
        var userGroupArray = user.group.ID;
        return directory.internalStore.Group.query("ID in :1", userGroupArray).toArray("ID,name,fullName");
    } catch (e) {
		console.error(e);
		return null;
	}
};





/*************************************************************
 *	Get groups user isnt in									 *
 *************************************************************/
exports.getUsersNotGroup = function getUsersNotGroup(id) {
	if(exports.userHaveAccess()!==true){
		return null;
	}
    try {
        var user = directory.internalStore.Usergroup.query("user.ID = :1", id);
        var userGroupArray = user.group.ID;
        var usersGroups = directory.internalStore.Group.query("ID in :1", userGroupArray);
        var allGroups = directory.internalStore.Group.all();
        var userNotInGroups = allGroups.minus(usersGroups);
        return userNotInGroups.toArray("ID,name,fullName");
    } catch (e) {
        console.error(e);
        return null;
    }
};





/*************************************************************
 *	Remove user from group									 *
 *************************************************************/
exports.removeUserFromGroup = function removeUserFromGroup(userId, groupId) {
	if(exports.userHaveAccess()!==true){
		return null;
	}
    var userID = null;
    try {
        var user = directory.user(userId);
        var group = directory.internalStore.Group.find("ID = :1", groupId);
        user.removeFrom(group.name);
    } catch (e) {
        console.error(e);
        return userID;
    }
    return user.ID;
};





/*************************************************************
 *	Add user to group										 *
 *************************************************************/
exports.addUserToGroup = function addUserToGroup(userId, groupId) {
	if(exports.userHaveAccess()!==true){
		return null;
	}
    var userID = null;
    try {
        var user = directory.user(userId);
        var group = directory.internalStore.Group.find("ID = :1", groupId);
        user.putInto(group.name);
    } catch (e) {
        console.error(e);
        return userID;
    }
    return user.ID;
};





/*************************************************************
 *	Add user												 *
 *************************************************************/
exports.addUser = function addUser(name, password, fullName) {
	if(exports.userHaveAccess()!==true){
		return null;
	}
    var userID = null;
    try {
        var user = directory.addUser(name, password, fullName);
        directory.save();
        userID = user.ID;
    } catch (e) {
        console.error(e);
        return userID;
    }
    return userID;
};





/*************************************************************
 *	Update user												 *
 *************************************************************/
exports.updateUser = function updateUser(id, name, password, fullName) {
	if(exports.userHaveAccess()!==true){
		return false;
	}

    var user = directory.internalStore.User.find("ID = :1", id);
    try {
        if (user !== null) {
            user.name = name;
            user.fullName = fullName;
            user.save();
            //set password, cant do both
            var setpassword = directory.user(id);
            if (password !== null && password !== "") {
                if (password === "null") {
                    setpassword.setPassword("");
                } else {
                    setpassword.setPassword(password);
                }
                directory.save();
            }
            return true;
        }
    } catch (e) {
        console.error(e);
        return false;
    }
    return true;
};





/*************************************************************
 *	Remove/delete user										 *
 *************************************************************/
exports.deleteUser = function deleteUser(id) {
	if(exports.userHaveAccess()!==true){
		return false;
	}

    try {
        var user = directory.user(id);
        user.remove();

    } catch (e) {
        console.error(e);
        return false;
    }

    return true;
};