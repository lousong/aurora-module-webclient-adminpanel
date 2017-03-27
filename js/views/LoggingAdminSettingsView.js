'use strict';

var
	_ = require('underscore'),
	$ = require('jquery'),
	ko = require('knockout'),
	
	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
	
	Ajax = require('%PathToCoreWebclientModule%/js/Ajax.js'),
	WindowOpener = require('%PathToCoreWebclientModule%/js/WindowOpener.js'),
	
	Settings = require('modules/%ModuleName%/js/Settings.js'),
	
	CAbstractSettingsFormView = require('modules/%ModuleName%/js/views/CAbstractSettingsFormView.js')
;

/**
* @constructor
*/
function CLoggingAdminSettingsView()
{
	CAbstractSettingsFormView.call(this, Settings.ServerModuleName);
	
	this.logSize = ko.observable(Settings.LogSizeBytes);
	this.downloadLogText = ko.computed(function () {
		return TextUtils.i18n('%MODULENAME%/BUTTON_LOGGING_DOWNLOAD', {'SIZE': TextUtils.getFriendlySize(this.logSize())});
	}, this);
	this.eventsLogSize = ko.observable(Settings.EventLogSizeBytes);
	this.downloadEventsLogText = ko.computed(function () {
		return TextUtils.i18n('%MODULENAME%/BUTTON_LOGGING_DOWNLOAD_EVENTS', {'SIZE': TextUtils.getFriendlySize(this.eventsLogSize())});
	}, this);
	
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
	Settings.updateLogging(oParameters.EnableLogging, oParameters.EnableEventLogging, oParameters.LoggingLevel);
};

CLoggingAdminSettingsView.prototype.setAccessLevel = function (sEntityType, iEntityId)
{
	this.visible(sEntityType === '');
};

CLoggingAdminSettingsView.prototype.downloadLog = function (bEventsLog)
{
	Ajax.send(Settings.ServerModuleName, 'GetLogFile', {'EventsLog': bEventsLog}, function (oResponse) {
		console.log('oResponse.Result', oResponse.Result);
	}, this);
};

CLoggingAdminSettingsView.prototype.viewLog = function (bEventsLog)
{
	Ajax.send(Settings.ServerModuleName, 'GetLog', {'EventsLog': bEventsLog}, function (oResponse) {
		if (oResponse.Result)
		{
			var oWin = WindowOpener.open('', 'view-log');
			if (oWin)
			{
				$(oWin.document.body).html('<pre>' + oResponse.Result + '</pre>');
			}
		}
	}, this);
};

CLoggingAdminSettingsView.prototype.clearLog = function (bEventsLog)
{
	Ajax.send(Settings.ServerModuleName, 'ClearLog', {'EventsLog': bEventsLog}, function (oResponse) {
		if (oResponse.Result)
		{
			if (bEventsLog)
			{
				this.eventsLogSize(0);
			}
			else
			{
				this.logSize(0);
			}
		}
	}, this);
};

module.exports = new CLoggingAdminSettingsView();
