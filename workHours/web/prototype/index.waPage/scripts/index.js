
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var button3 = {};	// @Button
	var button2 = {};	// @Button
	var menuItem2 = {};	// @menuItem
	var documentEvent = {};	// @document
	var button1 = {};	// @Button
	var login1 = {};	// @login
	var setCategoryClientBtn = {};	// @Button
// @endregion// @endlock

function resetTxt(txtID) {
	setTimeout(function () {$$(txtID).value("");}, 5000)	
;}

// eventHandlers// @lock

	button3.click = function button3_click (event)// @startlock
	{// @endlock
		waf.sources.category.removeUser(waf.sources.user.ID,{onSuccess: function (evt) {
			if (evt.result.res === true) {
				waf.sources.category.serverRefresh();
			}
			
			$$('assignUserToCategoryTxt').value(evt.result.message);
			resetTxt('assignUserToCategoryTxt');
		}, onError: function (err) {
			
		}});
	};// @lock

	button2.click = function button2_click (event)// @startlock
	{// @endlock
		waf.sources.category.addUser(waf.sources.user.ID,{onSuccess: function (evt) {
			if (evt.result.res === true) {
				waf.sources.category.serverRefresh();
			}
			
			$$('assignUserToCategoryTxt').value(evt.result.message);
			resetTxt('assignUserToCategoryTxt');
		}, onError: function (err) {
			
		}});
	};// @lock

	menuItem2.click = function menuItem2_click (event)// @startlock
	{// @endlock
		dirUser = directoryComponent.getUsers();
		waf.sources.dirUser.sync();
	};// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		$$('component1').loadComponent();
	};// @lock

	button1.click = function button1_click (event)// @startlock
	{// @endlock
		waf.sources.user.userID = waf.sources.dirUser.ID;
		waf.sources.user.save({onSuccess:function(evt){
			$$('linkDirectoryDisplayTxt').value("Done");
			resetTxt('linkDirectoryDisplayTxt');
		}, onError:function(err) {
			$$('linkDirectoryDisplayTxt').value("Error");
			resetTxt('linkDirectoryDisplayTxt');
		}});
	};// @lock

	login1.login = function login1_login (event)// @startlock
	{// @endlock
		
	};// @lock

	setCategoryClientBtn.click = function setCategoryClientBtn_click (event)// @startlock
	{// @endlock
		waf.sources.category.client.set(waf.sources.client.getCurrentElement());
		waf.sources.category.save({onSuccess:function(evt){
			waf.sources.category.serverRefresh();
			alertify.success('Client Linked')
		}});
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("button3", "click", button3.click, "WAF");
	WAF.addListener("button2", "click", button2.click, "WAF");
	WAF.addListener("menuItem2", "click", menuItem2.click, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
	WAF.addListener("button1", "click", button1.click, "WAF");
	WAF.addListener("login1", "login", login1.login, "WAF");
	WAF.addListener("setCategoryClientBtn", "click", setCategoryClientBtn.click, "WAF");
// @endregion
};// @endlock
