
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var menuItem2 = {};	// @menuItem
	var documentEvent = {};	// @document
	var button1 = {};	// @Button
	var login1 = {};	// @login
	var setCategoryClientBtn = {};	// @Button
// @endregion// @endlock

function resetlinkDirectoryDisplayTxt() {
	setTimeout(function () {$$('linkDirectoryDisplayTxt').value("");}, 5000)	
;}

// eventHandlers// @lock

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
			resetlinkDirectoryDisplayTxt();
		}, onError:function(err) {
			$$('linkDirectoryDisplayTxt').value("Error");
			resetlinkDirectoryDisplayTxt();
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
	WAF.addListener("menuItem2", "click", menuItem2.click, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
	WAF.addListener("button1", "click", button1.click, "WAF");
	WAF.addListener("login1", "login", login1.login, "WAF");
	WAF.addListener("setCategoryClientBtn", "click", setCategoryClientBtn.click, "WAF");
// @endregion
};// @endlock
