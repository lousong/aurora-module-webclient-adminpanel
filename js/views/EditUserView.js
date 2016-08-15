'use strict';

var
	$ = require('jquery'),
	ko = require('knockout'),
	
	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
	
	Screens = require('%PathToCoreWebclientModule%/js/Screens.js'),
	App = require('%PathToCoreWebclientModule%/js/App.js')
;

/**
 * @constructor
 */
function CEditUserView()
{
	this.sHeading = TextUtils.i18n('%MODULENAME%/HEADING_CREATE_USER');
	this.id = ko.observable(0);
	this.name = ko.observable('');
	this.aRoles = [
		{text: TextUtils.i18n('%MODULENAME%/LABEL_ADMINISTRATOR'), value: Enums.UserRole.SuperAdmin},
		{text: TextUtils.i18n('%MODULENAME%/LABEL_USER'), value: Enums.UserRole.PowerUser},
		{text: TextUtils.i18n('%MODULENAME%/LABEL_GUEST'), value: Enums.UserRole.RegisteredUser}
	];
	this.role = ko.observable(Enums.UserRole.PowerUser);
	
	App.broadcastEvent('%ModuleName%::ConstructView::after', {'Name': this.ViewConstructorName, 'View': this});
}

CEditUserView.prototype.ViewTemplate = '%ModuleName%_EditUserView';
CEditUserView.prototype.ViewConstructorName = 'CEditUserView';

CEditUserView.prototype.getCurrentValues = function ()
{
	return [
		this.id(),
		this.name(),
		this.role()
	];
};

CEditUserView.prototype.clearFields = function ()
{
	this.id(0);
	this.name('');
	this.role(Enums.UserRole.PowerUser);
};

CEditUserView.prototype.parse = function (iEntityId, oResult)
{
	if (oResult)
	{
		this.id(iEntityId);
		this.name(oResult.Name);
		this.role(oResult.Role);
	}
	else
	{
		this.clearFields();
	}
};

CEditUserView.prototype.isValidSaveData = function ()
{
	var bValid = $.trim(this.name()) !== '';
	if (!bValid)
	{
		Screens.showError(TextUtils.i18n('%MODULENAME%/ERROR_USER_NAME_EMPTY'));
	}
	return bValid;
};

CEditUserView.prototype.getParametersForSave = function ()
{
	return {
		Id: this.id(),
		Name: $.trim(this.name()),
		Role: this.role()
	};
};

module.exports = new CEditUserView();
