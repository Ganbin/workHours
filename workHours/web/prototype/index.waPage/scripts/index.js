
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var setCategoryClientBtn = {};	// @Button
	var categoryBtn = {};	// @Button
	var clientBtn = {};	// @Button
// @endregion// @endlock

// eventHandlers// @lock

	setCategoryClientBtn.click = function setCategoryClientBtn_click (event)// @startlock
	{// @endlock
		waf.sources.category.client.set(waf.sources.client.getCurrentElement());
		waf.sources.category.save({onSuccess:function(evt){
			waf.sources.category.serverRefresh();
			alertify.success('Client Linked')
		}});
	};// @lock

	categoryBtn.click = function categoryBtn_click (event)// @startlock
	{// @endlock
		waf.sources.workTime.category.set(waf.sources.category.getCurrentElement());
		waf.sources.workTime.save({onSuccess:function(evt){// @lock
			waf.sources.workTime.serverRefresh();
			alertify.success('Client Linked')
		},onErro:function(err){
			alertify.error('An error occurs');
		}});
	};// @lock

	clientBtn.click = function clientBtn_click (event)// @startlock
	{// @endlock
		waf.sources.workTime.client.set(waf.sources.client.getCurrentElement());
		waf.sources.workTime.save({onSuccess:function(evt){
			waf.sources.workTime.serverRefresh();
			alertify.success('Client Linked')
		},onErro:function(err){
			alertify.error('An error occurs');
		}});
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("setCategoryClientBtn", "click", setCategoryClientBtn.click, "WAF");
	WAF.addListener("categoryBtn", "click", categoryBtn.click, "WAF");
	WAF.addListener("clientBtn", "click", clientBtn.click, "WAF");
// @endregion
};// @endlock
