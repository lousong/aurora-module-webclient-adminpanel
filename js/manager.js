'use strict';

module.exports = function (oAppData) {
	var App = require('%PathToCoreWebclientModule%/js/App.js');
	
	if (App.getUserRole() === Enums.UserRole.SuperAdmin)
	{
		var
			_ = require('underscore'),
			
			TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
			
			Settings = require('modules/%ModuleName%/js/Settings.js'),
			oSettings = oAppData['%ModuleName%'] || {},
			
			aAdminPanelTabsParams = []
		;

		Settings.init(oSettings);

		return {
			start: function () {
				aAdminPanelTabsParams.push({
					GetTabView: function () { return require('modules/%ModuleName%/js/views/DbAdminSettingsView.js'); },
					TabName: Settings.HashModuleName + '-db',
					TabTitle: TextUtils.i18n('%MODULENAME%/LABEL_DB_SETTINGS_TAB')
				});
//				aAdminPanelTabsParams.push({
//					GetTabView: function () { return require('modules/%ModuleName%/js/views/LicensingAdminSettingsView.js'); },
//					TabName: Settings.HashModuleName + '-licensing',
//					TabTitle: TextUtils.i18n('%MODULENAME%/LABEL_LICENSING_SETTINGS_TAB')
//				});
				aAdminPanelTabsParams.push({
					GetTabView: function () { return require('modules/%ModuleName%/js/views/SecurityAdminSettingsView.js'); },
					TabName: Settings.HashModuleName + '-security',
					TabTitle: TextUtils.i18n('%MODULENAME%/LABEL_SECURITY_SETTINGS_TAB')
				});
//				aAdminPanelTabsParams.push({
//					GetTabView: function () { return require('modules/%ModuleName%/js/views/LoggingAdminSettingsView.js'); },
//					TabName: Settings.HashModuleName + '-logging',
//					TabTitle: TextUtils.i18n('%MODULENAME%/LABEL_LOGGING_SETTINGS_TAB')
//				});
				
				aAdminPanelTabsParams.push({
					GetTabView: function () { return require('modules/%ModuleName%/js/views/CommonSettingsPaneView.js'); },
					TabName: 'common',
					TabTitle: TextUtils.i18n('%MODULENAME%/LABEL_COMMON_SETTINGS_TAB')
				});
//				aAdminPanelTabsParams.push({
//					GetTabView: function () { return null; },
//					TabName: 'modules',
//					TabTitle: TextUtils.i18n('%MODULENAME%/LABEL_MODULES_SETTINGS_TAB')
//				});
			},
			getScreens: function () {
				var oScreens = {};
				oScreens[Settings.HashModuleName] = function () {
					var SettingsView = require('modules/%ModuleName%/js/views/SettingsView.js');
					_.each(aAdminPanelTabsParams, function (oParams) {
						SettingsView.registerTab(oParams.GetTabView, oParams.TabName, oParams.TabTitle);
					});
					return SettingsView;
				};
				return oScreens;
			},
			registerAdminPanelTab: function (fGetTabView, sTabName, sTabTitle) {
				aAdminPanelTabsParams.push({
					GetTabView: fGetTabView,
					TabName: sTabName,
					TabTitle: sTabTitle
				});
			}
		};
	}
	
	return null;
};
