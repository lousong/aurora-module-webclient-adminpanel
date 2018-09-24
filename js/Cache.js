'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),
	
	Types = require('%PathToCoreWebclientModule%/js/utils/Types.js'),
	
	App = require('%PathToCoreWebclientModule%/js/App.js'),
	
	Settings = require('modules/%ModuleName%/js/Settings.js');
;

function CCache()
{
	this.tenants = ko.observableArray([]);
	this.selectedTenant = ko.computed(function () {
		return _.find(this.tenants(), function (oTenant) {
			return oTenant.selected();
		}) || { Name: '' };
	}, this);
}

CCache.prototype.init = function (oAppData) {
	// Cache should be initialized in manager.js because it should be able to add Tenant parameter to all AJAX requests
	
	App.subscribeEvent('ReceiveAjaxResponse::after', this.onAjaxResponse.bind(this));
	App.subscribeEvent('SendAjaxRequest::before', this.onAjaxSend.bind(this));
	
	var oAppDataSection = oAppData[Settings.ServerModuleName];
	this.parseTenants(oAppDataSection ? oAppDataSection.Tenants : []);
};

CCache.prototype.onAjaxResponse = function (oParams) {
	if (oParams.Response.Module === Settings.ServerModuleName && oParams.Response.Method === 'GetEntityList' && oParams.Request.Parameters.Type === 'Tenant')
	{
		this.parseTenants(oParams.Response.Result);
	}
};

CCache.prototype.onAjaxSend = function (oParams)
{
	if (!oParams.Parameters.Tenant)
	{
		oParams.Parameters.Tenant = this.selectedTenant().Id;
	}
};

CCache.prototype.parseTenants = function (oResult)
{
	var
		iSelectedId = this.selectedTenant().Id,
		bHasSelected = false,
		aTenantsData = oResult && _.isArray(oResult.Items) ? oResult.Items : [],
		aTenants = []
	;

	_.each(aTenantsData, function (oTenantData) {
		var oTenant = {
			Name: oTenantData.Name,
			Id: Types.pInt(oTenantData.Id),
			selected: ko.observable(false)
		};
		if (oTenant.Id === iSelectedId)
		{
			oTenant.selected(true);
			bHasSelected = true;
		}
		aTenants.push(oTenant);
	});

	if (!bHasSelected && aTenants.length > 0)
	{
		aTenants[0].selected(true);
	}
	
	this.tenants(aTenants);
};

module.exports = new CCache();
