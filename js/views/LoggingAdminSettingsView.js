'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),
	
	Settings = require('%PathToCoreWebclientModule%/js/Settings.js'),
	
	CAbstractSettingsFormView = require('modules/%ModuleName%/js/views/CAbstractSettingsFormView.js')
;

/**
* @constructor
*/
function CLoggingAdminSettingsView()
{
	CAbstractSettingsFormView.call(this, Settings.ServerModuleName);
	
	/* Editable fields */
	this.enableLogging = ko.observable(Settings.EnableLogging);
	this.enableEventLogging = ko.observable(Settings.EnableEventLogging);
	this.loggingLevel = ko.observable(Settings.LoggingLevel);
	/*-- Editable fields */
}

_.extendOwn(CLoggingAdminSettingsView.prototype, CAbstractSettingsFormView.prototype);

CLoggingAdminSettingsView.prototype.ViewTemplate = '%ModuleName%_LoggingAdminSettingsView';

CLoggingAdminSettingsView.prototype.getCurrentValues = function()
{
	return [
		this.enableLogging(),
		this.enableEventLogging(),
		this.loggingLevel()
	];
};

CLoggingAdminSettingsView.prototype.revertGlobalValues = function()
{
	this.enableLogging(Settings.EnableLogging);
	this.enableEventLogging(Settings.EnableEventLogging);
	this.loggingLevel(Settings.LoggingLevel);
};

CLoggingAdminSettingsView.prototype.getParametersForSave = function ()
{
	return {
		'EnableLogging': this.enableLogging(),
		'EnableEventLogging': this.enableEventLogging(),
		'LoggingLevel': this.loggingLevel()
	};
};

/**
 * @param {Object} oParameters
 */
CLoggingAdminSettingsView.prototype.applySavedValues = function (oParameters)
{
//	Settings.updateLogging(oParameters.EnableLogging, oParameters.EnableEventLogging, oParameters.LoggingLevel);
};

CLoggingAdminSettingsView.prototype.setAccessLevel = function (sEntityType, iEntityId)
{
	this.visible(sEntityType === '');
};

module.exports = new CLoggingAdminSettingsView();