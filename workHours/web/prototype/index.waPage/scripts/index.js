
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var login1 = {};	// @login
	var setCategoryClientBtn = {};	// @Button
// @endregion// @endlock

// eventHandlers// @lock

	login1.login = function login1_login (event)// @startlock
	{// @endlock
		debugger;
		waf.sources.category.resolveSource();
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
	WAF.addListener("login1", "login", login1.login, "WAF");
	WAF.addListener("setCategoryClientBtn", "click", setCategoryClientBtn.click, "WAF");
// @endregion
};// @endlock
