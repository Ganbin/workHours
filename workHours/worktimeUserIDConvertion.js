/*
 * This file when run will convert all the userID of a worktime to assign the corresponding user from the user dataclass
 * Before runing this, be sure to create the user in the dataclass and bind the directory user with the corresponding user
 * 
 * This file have to be run only one time so do the baclkup before running to be sure everything is well done
 */

loginByPassword('dataAdmin','data123');

ds.WorkTime.all().forEach(function (time) {
	if (time.userID != null) {
		time.user = ds.User.find('userID == :1', time.userID);
	}
});

ds.WorkTime.all()