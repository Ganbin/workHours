
(function Component (id) {// @lock

// Add the code that needs to be shared between components here

function constructor (id) {

	// @region beginComponentDeclaration// @startlock
	var $comp = this;
	this.name = 'directoryComponent';
	// @endregion// @endlock


	this.load = function (data) {// @lock



			//some reason the $comp so I add this to it.
			$comp = this;


			/************************************************************
			*	Resets usersm then resets group grids					*
			*************************************************************/
			refreshAll = function () {
				$comp.sourcesVar.users = directoryComponent.getUsers();
				$comp.sources.users.sync();
				var users = $comp.sourcesVar.users;
				if (users.length !== 0) {
					updateUsersGrids(users[0].ID);
				} else {
					updateUsersGrids("");
				}
			}





			/************************************************************
		 	*	Refreshes group grids					*
		 	*************************************************************/
			updateUsersGrids = function(ID) {
				$comp.sourcesVar.userInGroup = directoryComponent.getUsersGroups(ID);
				$comp.sources.userInGroup.sync();
				$comp.sourcesVar.userNotInGroup = directoryComponent.getUsersNotGroup(ID);
				$comp.sources.userNotInGroup.sync();	
			}


			
			//refresh all
			refreshAll();	
	

	// @region namespaceDeclaration// @startlock
	var usersEvent = {};	// @dataSource
	var cancelBtn = {};	// @button
	var UserID_textField = {};	// @textField
	var removeBtn = {};	// @button
	var refreshBtn = {};	// @button
	var newBtn = {};	// @button
	var saveBtn = {};	// @button
	var addGroupBtn = {};	// @button
	var removeGroupBtn = {};	// @button
	// @endregion// @endlock
	
	// eventHandlers// @lock

	usersEvent.onCurrentElementChange = function usersEvent_onCurrentElementChange (event)// @startlock
	{// @endlock
		var userID = $comp.sources.users.ID
		if(userID === null || userID === undefined){
			updateUsersGrids("");
		} else {
			var selectedEntity = $$(getHtmlId("userGrid")).dataSource.getCurrentElement();
			//reset the password
			$comp.sourcesVar.password =null;
			$comp.sources.password.sync();
			$$(getHtmlId("groupChange")).setValue("");
			//need timeout here else everything goes to hell!
			setTimeout(function(){	
				var selectedEntity = $$(getHtmlId("userGrid")).dataSource.getCurrentElement();
				var ID = selectedEntity.ID;
				updateUsersGrids(ID);
				},100)
			$$(getHtmlId("userChange")).setValue("");
		}
	};// @lock

	usersEvent.onBeforeCurrentElementChange = function usersEvent_onBeforeCurrentElementChange (event)// @startlock
	{// @endlock
		var userID = $comp.sources.users.ID
		if(userID === null || userID === undefined){
			$comp.sources.users.removeCurrent();
			$$(getHtmlId("userChange")).setValue("Empty row Removed");
		}
	};// @lock

	cancelBtn.click = function cancelBtn_click (event)// @startlock
	{// @endlock
		var userID = $comp.sources.users.ID
		if (userID === undefined) {
			$comp.sources.users.removeCurrent();
			$$(getHtmlId("userChange")).setValue("Empty row Removed");
		}
	};// @lock

	UserID_textField.keydown = function UserID_textField_keydown (event)// @startlock
	{// @endlock
		return false;
	};// @lock

	removeBtn.click = function removeBtn_click (event)// @startlock
	{// @endlock
		
		var userID = $comp.sources.users.name;
		if(userID !== "") {
			if ($comp.sources.users.ID === undefined) {
				$comp.sources.users.removeCurrent();
				$$(getHtmlId("userChange")).setValue("Empty row Removed");
			} else {
				var result = directoryComponent.deleteUser($comp.sources.users.ID);
				if(result === true){
					$comp.sources.users.removeCurrent();
					$comp.sources.users.sync();
					MyId = "";
					if($comp.sources.users.ID !== undefined){
					MyId = $comp.sources.users.ID;
					}
					$$(getHtmlId("userChange")).setValue("User     >>"+userID+"<<     Removed");
					updateUsersGrids(MyId);	
					} else {
						$$(getHtmlId("userChange")).setValue("Error: please refresh the directory");
					}
			}
		} else {
			$$(getHtmlId("userChange")).setValue("Error: Empty username is now allowed");
		}
	};// @lock

	refreshBtn.click = function refreshBtn_click (event)// @startlock
	{// @endlock
		refreshAll();
	};// @lock

	newBtn.click = function newBtn_click (event)// @startlock
	{// @endlock
		$comp.sources.users.addNewElement();
		$comp.sources.users.name = "";
		$comp.sources.users.fullName = "";
		$comp.sources.password.password = null;
		updateUsersGrids("");
	};// @lock

	saveBtn.click = function saveBtn_click (event)// @startlock
	{// @endlock
		if ($comp.sources.users.ID === undefined) {
			var result = directoryComponent.addUser($comp.sources.users.name, $comp.sourcesVar.password, $comp.sources.users.fullName);
			if(result !== null){
				
				var selectedEntity = $$(getHtmlId("userGrid")).dataSource.getCurrentElement();
				selectedEntity.ID = result;
				sources[$comp.id+"_users"].sync();
				$$(getHtmlId("userChange")).setValue("User added");
			}
		} else {
			var result = directoryComponent.updateUser($comp.sources.users.ID, $comp.sources.users.name,  $comp.sourcesVar.password, $comp.sources.users.fullName);
			if(result !== null){
				$$(getHtmlId("userChange")).setValue("User changes saved");
			} else {
				$$(getHtmlId("userChange")).setValue("Error, no changes saved");
			}
		}
		if(result === null || $comp.sources.users.ID === null){

			$$(getHtmlId("userChange")).setValue("Error, no changes saved");
		} 
	};// @lock

	addGroupBtn.click = function addGroupBtn_click (event)// @startlock
	{// @endlock
		if($comp.sources.users.ID === undefined || $comp.sources.users.ID === null){
			$$(getHtmlId("groupChange")).setValue("Error : no user selected");
		} else {
			var myGroup = $comp.sources.userNotInGroup.name;
			var myUser = $comp.sources.users.name
			var result = directoryComponent.addUserToGroup($comp.sources.users.ID, $comp.sources.userNotInGroup.ID)
			updateUsersGrids($comp.sources.users.ID);
			if(result === null){
				$$(getHtmlId("groupChange")).setValue("Error : >>" + myGroup + "<< was not added to >>" + myUser + "<< changes saved");
			} else {
				$$(getHtmlId("groupChange")).setValue("Success : >>" + myGroup + "<< was added to >>" + myUser + "<< changes saved");
			}
		}
		
	};// @lock

	removeGroupBtn.click = function removeGroupBtn_click (event)// @startlock
	{// @endlock
		if($comp.sources.users.ID === undefined || $comp.sources.users.ID === null){
			$$(getHtmlId("groupChange")).setValue("Error : no user selected");
		} else {
			var myGroup = $comp.sources.userInGroup.name;
			var myUser = $comp.sources.users.name
			if(myUser !== undefined && myGroup !== undefined){
				var result = directoryComponent.removeUserFromGroupAsync({onSuccess: function (evt) {
					debugger;
				}, onError: function (err) {
					debugger;
				},
				params: [$comp.sources.users.ID, $comp.sources.userInGroup.ID]});
				
				updateUsersGrids($comp.sources.users.ID);
				if(result === null){
					$$(getHtmlId("groupChange")).setValue("Error : >>"+myGroup+"<< was not removed from >>" + myUser + "<< changes saved");
				} else {
					$$(getHtmlId("groupChange")).setValue("Success : >>"+myGroup+"<< was removed from >>" + myUser + "<< changes saved");
				}
			} else {
				$$(getHtmlId("groupChange")).setValue("Error : user or group not selected");
			}
		}
	};// @lock

	// @region eventManager// @startlock
	WAF.addListener(this.id + "_users", "onCurrentElementChange", usersEvent.onCurrentElementChange, "WAF");
	WAF.addListener(this.id + "_users", "onBeforeCurrentElementChange", usersEvent.onBeforeCurrentElementChange, "WAF");
	WAF.addListener(this.id + "_cancelBtn", "click", cancelBtn.click, "WAF");
	WAF.addListener(this.id + "_UserID_textField", "keydown", UserID_textField.keydown, "WAF");
	WAF.addListener(this.id + "_removeBtn", "click", removeBtn.click, "WAF");
	WAF.addListener(this.id + "_refreshBtn", "click", refreshBtn.click, "WAF");
	WAF.addListener(this.id + "_newBtn", "click", newBtn.click, "WAF");
	WAF.addListener(this.id + "_saveBtn", "click", saveBtn.click, "WAF");
	WAF.addListener(this.id + "_addGroupBtn", "click", addGroupBtn.click, "WAF");
	WAF.addListener(this.id + "_removeGroupBtn", "click", removeGroupBtn.click, "WAF");
	// @endregion// @endlock

	};// @lock


}// @startlock
return constructor;
})();// @endlock
