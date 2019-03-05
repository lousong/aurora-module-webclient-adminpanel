'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),
	
	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
	Types = require('%PathToCoreWebclientModule%/js/utils/Types.js')
;

function ParseAdditionalFields(sEntityType)
{
	var aAdditionalFields = Types.pArray(window.auroraAppData && window.auroraAppData.additional_entity_fields_to_edit);
	return _.filter(aAdditionalFields, function (oFieldData) {
		oFieldData.value = ko.observable('');
		return oFieldData.Entity === sEntityType;
	});
}

/**
 * @constructor
 */
function CEditTenantView()
{
	this.sHeading = TextUtils.i18n('%MODULENAME%/HEADING_CREATE_TENANT');
	this.id = ko.observable(0);
	this.name = ko.observable('');
	this.description = ko.observable('');
	this.webDomain = ko.observable('');
	this.siteName = ko.observable('');
	
	this.aAdditionalFields = ParseAdditionalFields('Tenant');
}

CEditTenantView.prototype.ViewTemplate = '%ModuleName%_EditTenantView';

CEditTenantView.prototype.getCurrentValues = function ()
{
	var aFieldsValues = [
		this.id(),
		this.name(),
		this.description(),
		this.webDomain(),
		this.siteName()
	];
	
	_.each(this.aAdditionalFields, function (oField) {
		aFieldsValues.push(oField.value());
	});
	
	return aFieldsValues;
};

CEditTenantView.prototype.clearFields = function ()
{
	this.id(0);
	this.name('');
	this.description('');
	this.webDomain('');
	this.siteName('');
	
	_.each(this.aAdditionalFields, function (oField) {
		oField.value('');
	});
};

CEditTenantView.prototype.parse = function (iEntityId, oResult)
{
	if (oResult)
	{
		this.id(iEntityId);
		this.name(oResult.Name);
		this.description(oResult.Description);
		this.webDomain(oResult.WebDomain);
		this.siteName(oResult.SiteName);
		
		_.each(this.aAdditionalFields, function (oField) {
			oField.value(Types.pString(oResult[oField.FieldName]));
		});
	}
	else
	{
		this.clearFields();
	}
};

CEditTenantView.prototype.getParametersForSave = function ()
{
	var oParameters = {
		Id: this.id(),
		Name: this.name(),
		Description: this.description(),
		WebDomain: this.webDomain(),
		SiteName: this.siteName()
	};
	
	_.each(this.aAdditionalFields, function (oField) {
		oParameters[oField.FieldName] = oField.value();
	});
	
	return oParameters;
};

module.exports = new CEditTenantView();
