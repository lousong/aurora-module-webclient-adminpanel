'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),
	
	TextUtils = require('modules/CoreClient/js/utils/Text.js'),
	Types = require('modules/CoreClient/js/utils/Types.js'),
	
	Screens = require('modules/CoreClient/js/Screens.js'),
	
	Popups = require('modules/CoreClient/js/Popups.js'),
	ConfirmPopup = require('modules/CoreClient/js/popups/ConfirmPopup.js'),
	
	Ajax = require('modules/%ModuleName%/js/Ajax.js')
;

/**
 * Constructor of entities view. Creates, edits and deletes entities.
 * 
 * @param {string} sEntityType Type of entity processed here.
 * 
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
	
	this.justCreatedId = ko.observable(0);
	this.fChangeEntityHandler = function () {};
	
	ko.computed(function () {
		if (this.justCreatedId() === 0 && !this.showCreateForm() && !this.hasSelectedEntity() && this.entities().length > 0)
		{
			this.fChangeEntityHandler(this.sType, this.entities()[0].id);
		}
	}, this);
}

CEntitiesView.prototype.ViewTemplate = '%ModuleName%_EntitiesView';

/**
 * Returns entity edit view for cpecified entity type.
 */
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

/**
 * Requests entity list after showing.
 */
CEntitiesView.prototype.onShow = function ()
{
	this.requestEntities();
};

/**
 * Requests entity list.
 */
CEntitiesView.prototype.requestEntities = function ()
{
	Ajax.send('GetEntities', {Type: this.sType}, function (oResponse) {
		this.entities(oResponse.Result);
		if (this.entities().length === 0)
		{
			this.fChangeEntityHandler(this.sType, undefined, 'create');
		}
		else if (this.justCreatedId() !== 0)
		{
			this.fChangeEntityHandler(this.sType, this.justCreatedId(), 'basicauth-accounts');
		}
	}, this);
};

/**
 * Sets change entity hanler provided by parent view object.
 * 
 * @param {Function} fChangeEntityHandler Change entity handler.
 */
CEntitiesView.prototype.setChangeEntityHandler = function (fChangeEntityHandler)
{
	this.fChangeEntityHandler = fChangeEntityHandler;
};

/**
 * Sets new current entity indentificator.
 * 
 * @param {number} iId New current entity indentificator.
 */
CEntitiesView.prototype.changeEntity = function (iId)
{
	this.current(Types.pInt(iId));
	this.justCreatedId(0);
};

/**
 * Opens create entity form.
 */
CEntitiesView.prototype.openCreateForm = function ()
{
	this.showCreateForm(true);
	this.oEntityCreateView.clearFields();
};

/**
 * Hides create entity form.
 */
CEntitiesView.prototype.cancelCreatingEntity = function ()
{
	this.showCreateForm(false);
};

/**
 * Send request to server to create new entity.
 */
CEntitiesView.prototype.createEntity = function ()
{
	this.isCreating(true);
	Ajax.send('CreateEntity', {Type: this.sType, Data: this.oEntityCreateView.getParametersForSave()}, function (oResponse) {
		if (oResponse.Result)
		{
			Screens.showReport(TextUtils.i18n('%MODULENAME%/REPORT_CREATE_ENTITY_' + this.sType.toUpperCase()));
			this.justCreatedId(oResponse.Result.iObjectId);
			this.cancelCreatingEntity();
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

/**
 * Deletes current entity.
 */
CEntitiesView.prototype.deleteCurrentEntity = function ()
{
	Popups.showPopup(ConfirmPopup, [TextUtils.i18n('CORECLIENT/CONFIRM_ARE_YOU_SURE'), _.bind(this.confirmedDeleteCurrentEntity, this)]);
};

/**
 * Sends request to the server to delete entity if admin confirmed this action.
 * 
 * @param {boolean} bDelete Indicates if admin confirmed deletion.
 */
CEntitiesView.prototype.confirmedDeleteCurrentEntity = function (bDelete)
{
	if (bDelete)
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
	}
};

module.exports = CEntitiesView;
