'use strict';

var
	_ = require('underscore'),
	
	Types = require('%PathToCoreWebclientModule%/js/utils/Types.js'),
	Settings = require('%PathToCoreWebclientModule%/js/Settings.js'),
	
	CAbstractSettingsFormView = require('modules/%ModuleName%/js/views/CAbstractSettingsFormView.js')
;

/**
* @constructor
*/
function CAboutAdminSettingsView()
{
	CAbstractSettingsFormView.call(this, Settings.ServerModuleName);
	
	/* Editable fields */
	this.sVersion = Types.pString(Settings.Version);
	this.sProductName = Types.pString(Settings.ProductName);
	/*-- Editable fields */
}

_.extendOwn(CAboutAdminSettingsView.prototype, CAbstractSettingsFormView.prototype);

CAboutAdminSettingsView.prototype.ViewTemplate = '%ModuleName%_AboutAdminSettingsView';

module.exports = new CAboutAdminSettingsView();
