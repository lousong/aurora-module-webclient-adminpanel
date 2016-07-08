'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),
	
	TextUtils = require('modules/CoreClient/js/utils/Text.js'),
	
	Screens = require('modules/CoreClient/js/Screens.js'),
	
	Popups = require('modules/CoreClient/js/Popups.js'),
	ConfirmPopup = require('modules/CoreClient/js/popups/ConfirmPopup.js'),
	
	Ajax = require('modules/%ModuleName%/js/Ajax.js')
;

/**
 * @param {string} sEntityType
 * @constructor
 */
function CEntitiesView(sEntityType)
{
	this.sType = sEntityType;
	this.oEntityCreateView = this.getEntityCreateView();
	this.entities = ko.observableArray([]);
	this.current = ko.observable(0);
	this.showCreateForm = ko.observable(false);
	this.isCreating = ko.observable(false);
	this.hasSelectedEntity = ko.computed(function () {
		var aIds = _.map(this.entities(), function (oEntity) {
			return oEntity.id;
		});
		return _.indexOf(aIds, this.current()) !== -1;
	}, this);
}

CEntitiesView.prototype.ViewTemplate = '%ModuleName%_EntitiesView';

CEntitiesView.prototype.getEntityCreateView = function ()
{
	switch (this.sType)
	{
		case 'Tenant':
			return require('modules/%ModuleName%/js/views/EditTenantView.js');
		case 'User':
			return require('modules/%ModuleName%/js/views/EditUserView.js');
	}
};

CEntitiesView.prototype.onShow = function ()
{
	this.requestEntities();
};

CEntitiesView.prototype.requestEntities = function ()
{
	Ajax.send('GetEntities', {Type: this.sType}, function (oResponse) {
		this.entities(oResponse.Result);
	}, this);
};

CEntitiesView.prototype.changeEntity = function (iId)
{
	this.current(iId);
};

CEntitiesView.prototype.openCreateForm = function (fAfterCreating)
{
	this.fAfterCreating = fAfterCreating;
	this.showCreateForm(true);
};

CEntitiesView.prototype.cancelCreatingEntity = function ()
{
	this.showCreateForm(false);
};

CEntitiesView.prototype.createEntity = function ()
{
	this.isCreating(true);
	Ajax.send('CreateEntity', {Type: this.sType, Data: this.oEntityCreateView.getParametersForSave()}, function (oResponse) {
		if (oResponse.Result)
		{
			Screens.showReport(TextUtils.i18n('%MODULENAME%/REPORT_CREATE_ENTITY_' + this.sType.toUpperCase()));
			if (_.isFunction(this.fAfterCreating))
			{
				this.fAfterCreating();
			}
		}
		else
		{
			Screens.showError(TextUtils.i18n('%MODULENAME%/ERROR_CREATE_ENTITY_' + this.sType.toUpperCase()));
		}
		this.requestEntities();
		this.isCreating(false);
	}, this);
	
	this.oEntityCreateView.clearFields();
};

CEntitiesView.prototype.deleteCurrentEntity = function ()
{
	Popups.showPopup(ConfirmPopup, [TextUtils.i18n('CORECLIENT/CONFIRM_ARE_YOU_SURE'), _.bind(this.confirmedDeleteCurrentEntity, this)]);
};

CEntitiesView.prototype.confirmedDeleteCurrentEntity = function ()
{
	Ajax.send('DeleteEntity', {Type: this.sType, Id: this.current()}, function (oResponse) {
		if (oResponse.Result)
		{
			Screens.showReport(TextUtils.i18n('%MODULENAME%/REPORT_DELETE_ENTITY_' + this.sType.toUpperCase()));
		}
		else
		{
			Screens.showError(TextUtils.i18n('%MODULENAME%/ERROR_DELETE_ENTITY_' + this.sType.toUpperCase()));
		}
		this.requestEntities();
	}, this);
};

module.exports = CEntitiesView;
