'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),
	
	Types = require('%PathToCoreWebclientModule%/js/utils/Types.js'),
	
	Ajax = require('%PathToCoreWebclientModule%/js/Ajax.js'),
	App = require('%PathToCoreWebclientModule%/js/App.js'),
	Screens = require('%PathToCoreWebclientModule%/js/Screens.js'),
	
	EntitiesTabs = require('modules/%ModuleName%/js/EntitiesTabs.js'),
	CAbstractSettingsFormView = require('modules/%ModuleName%/js/views/CAbstractSettingsFormView.js')
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
		return EntitiesTabs.getEditView(this.type());
	}, this);
	
	this.entityCreateView.subscribe(function () {
		if (this.entityCreateView() && _.isFunction(this.entityCreateView().setRequestEntityDataFunction))
		{
			this.entityCreateView().setRequestEntityDataFunction(this.requestEntityData.bind(this));
		}
		this.updateSavedState();
	}, this);
	
	this.entityData = ko.computed(function () {
		return EntitiesTabs.getEntityData(this.type());
	}, this);
	
	this.allowSave = ko.computed(function () {
		return !!this.entityData().UpdateRequest;
	}, this);
	
	this.updateSavedState();
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
	if (this.entityData().UpdateRequest && this.entityCreateView() && (!_.isFunction(this.entityCreateView().isValidSaveData) || this.entityCreateView().isValidSaveData()))
	{
		Ajax.send(this.entityData().ServerModuleName, this.entityData().UpdateRequest, {Type: this.type(), Data: this.entityCreateView() ? this.entityCreateView().getParametersForSave() : {}}, function (oResponse) {
			if (oResponse.Result)
			{
				Screens.showReport(this.entityData().ReportSuccessUpdate);
			}
			else
			{
				Screens.showError(this.entityData().ErrorUpdate);
			}

			if (oParent && _.isFunction(oParent.currentEntitiesView) && _.isFunction(oParent.currentEntitiesView().requestEntities))
			{
				oParent.currentEntitiesView().requestEntities();
			}

			this.updateSavedState();
		}, this);
	}
};

CCommonSettingsPaneView.prototype.requestEntityData = function ()
{
	Ajax.send(this.entityData().ServerModuleName, this.entityData().GetRequest, {Type: this.type(), Id: this.id()}, function (oResponse, oRequest) {
		if (this.id() === oRequest.Parameters.Id)
		{
			if (this.entityCreateView())
			{
				this.entityCreateView().parse(this.id(), oResponse.Result);
			}
			this.updateSavedState();
		}
	}, this);
};

CCommonSettingsPaneView.prototype.setAccessLevel = function (sEntityType, iEntityId)
{
	this.visible(sEntityType !== '');
	this.type(sEntityType);
	this.id(Types.pInt(iEntityId));
	if (Types.isPositiveNumber(this.id()))
	{
		this.requestEntityData();
	}
	else
	{
		this.updateSavedState();
	}
};

CCommonSettingsPaneView.prototype.onRoute = function ()
{
	App.broadcastEvent('CCommonSettingsPaneView::onRoute::after', {'View': this.entityCreateView(), 'Id': this.id()});
};

module.exports = new CCommonSettingsPaneView();
