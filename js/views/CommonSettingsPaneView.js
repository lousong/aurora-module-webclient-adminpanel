'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),
	
	TextUtils = require('modules/CoreClient/js/utils/Text.js'),
	
	ModulesManager = require('modules/CoreClient/js/ModulesManager.js'),
	Screens = require('modules/CoreClient/js/Screens.js'),
	
	CAbstractSettingsFormView = ModulesManager.run('SettingsClient', 'getAbstractSettingsFormViewClass'),
	
	Ajax = require('modules/%ModuleName%/js/Ajax.js')
;

/**
 * @constructor
 */
function CCommonSettingsPaneView()
{
	CAbstractSettingsFormView.call(this);
	
	this.type = ko.observable('User');
	this.id = ko.observable(0);
	
	this.entityCreateView = ko.computed(function ()
	{
		switch (this.type())
		{
			case 'Tenant':
				return require('modules/%ModuleName%/js/views/EditTenantView.js');
			case 'User':
				return require('modules/%ModuleName%/js/views/EditUserView.js');
		}
	}, this);
}

_.extendOwn(CCommonSettingsPaneView.prototype, CAbstractSettingsFormView.prototype);

CCommonSettingsPaneView.prototype.ViewTemplate = '%ModuleName%_CommonSettingsPaneView';

/**
 * Returns an array with the values of editable fields.
 * 
 * @returns {Array}
 */
CCommonSettingsPaneView.prototype.getCurrentValues = function ()
{
	return this.entityCreateView() ? this.entityCreateView().getCurrentValues() : [];
};

/**
 * Puts values from the global settings object to the editable fields.
 */
CCommonSettingsPaneView.prototype.revertGlobalValues = function ()
{
	if (this.entityCreateView())
	{
		this.entityCreateView().clearFields();
	}
	this.updateSavedState();
};

CCommonSettingsPaneView.prototype.save = function (oParent)
{
	Ajax.send('SaveEntity', {Type: this.type(), Data: this.entityCreateView() ? this.entityCreateView().getParametersForSave() : {}}, function (oResponse) {
		if (oResponse.Result)
		{
			Screens.showReport(TextUtils.i18n('%MODULENAME%/REPORT_UPDATE_ENTITY_' + this.type().toUpperCase()));
		}
		else
		{
			Screens.showError(TextUtils.i18n('%MODULENAME%/ERROR_UPDATE_ENTITY_' + this.type().toUpperCase()));
		}
		
		if (oParent && _.isFunction(oParent.currentEntitiesView) && _.isFunction(oParent.currentEntitiesView().requestEntities))
		{
			oParent.currentEntitiesView().requestEntities();
		}
		
		this.updateSavedState();
	}, this);
};

CCommonSettingsPaneView.prototype.setAccessLevel = function (sEntityType, iEntityId)
{
	this.visible(sEntityType !== '');
	this.type(sEntityType);
	this.id(iEntityId);
};

CCommonSettingsPaneView.prototype.onRoute = function ()
{
	Ajax.send('GetEntity', {Type: this.type(), Id: this.id()}, function (oResponse) {
		if (this.entityCreateView())
		{
			this.entityCreateView().parse(this.id(), oResponse.Result);
		}
		this.updateSavedState();
	}, this);
};

module.exports = new CCommonSettingsPaneView();
