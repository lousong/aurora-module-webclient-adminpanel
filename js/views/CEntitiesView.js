'use strict';

var
	ko = require('knockout'),
	
	TextUtils = require('modules/CoreClient/js/utils/Text.js'),
	
	Screens = require('modules/CoreClient/js/Screens.js'),
	
	Ajax = require('modules/%ModuleName%/js/Ajax.js'),
	Settings = require('modules/%ModuleName%/js/Settings.js')
;

/**
 * @param {string} sEntityName
 * @constructor
 */
function CEntitiesView(sEntityName)
{
	this.sName = sEntityName;
	this.sType = Settings.EntitiesData[sEntityName] ? Settings.EntitiesData[sEntityName].objectName : sEntityName;
	this.entities = ko.observableArray([]);
	this.current = ko.observable(0);
	this.newEntityName = ko.observable('');
	this.newEntityDescription = ko.observable('');
	this.showCreateForm = ko.observable(false);
	this.isCreating = ko.observable(false);
}

CEntitiesView.prototype.ViewTemplate = '%ModuleName%_EntitiesView';

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

CEntitiesView.prototype.openCreateForm = function ()
{
	this.showCreateForm(true);
};

CEntitiesView.prototype.cancelCreatingEntity = function ()
{
	this.showCreateForm(false);
};

CEntitiesView.prototype.createEntity = function ()
{
	this.isCreating(true);
	Ajax.send('CreateEntity', {Type: this.sType, Name: this.newEntityName(), Description: this.newEntityDescription()}, function (oResponse) {
		if (oResponse.Result)
		{
			Screens.showReport(TextUtils.i18n('%MODULENAME%/REPORT_CREATE_ENTITY_' + this.sType.toUpperCase()));
			this.showCreateForm(false);
		}
		else
		{
			Screens.showError(TextUtils.i18n('%MODULENAME%/ERROR_CREATE_ENTITY_' + this.sType.toUpperCase()));
		}
		this.requestEntities();
		this.isCreating(false);
	}, this);
	this.newEntityName('');
	this.newEntityDescription('');
};

module.exports = CEntitiesView;
