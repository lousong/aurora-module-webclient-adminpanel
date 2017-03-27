'use strict';

var Types = require('%PathToCoreWebclientModule%/js/utils/Types.js');

module.exports = {
	ServerModuleName: 'AdminPanelWebclient',
	HashModuleName: 'admin',
	
	EntitiesData: [
//		{
//			Type: 'Tenant',
//			ScreenHash: 'tenants',
//			LinkTextKey: '%MODULENAME%/HEADING_TENANTS_SETTINGS_TABNAME'
//		},
		{
			Type: 'User',
			ScreenHash: 'users',
			LinkTextKey: '%MODULENAME%/HEADING_USERS_SETTINGS_TABNAME'
		}
	],
	
	TabsOrder: ['admin-licensing', 'admin-security', 'admin-db', 'admin-logging', 'common', 'modules', 'mail', 'mail-domains', 'mail-accounts', 'contacts', 'calendar', 'files', 'mobilesync', 'outlooksync', 'helpdesk', 'openpgp'],
	
	init: function (oAppDataSection) {
		if (oAppDataSection)
		{
			if (Types.isNonEmptyArray(oAppDataSection.TabsOrder))
			{
				this.TabsOrder = oAppDataSection.TabsOrder;
			}
			this.EnableLogging = !!oAppDataSection.EnableLogging;
			this.LogSizeBytes = Types.pInt(oAppDataSection.LogSizeBytes);
			this.EnableEventLogging = !!oAppDataSection.EnableEventLogging;
			this.EventLogSizeBytes = Types.pInt(oAppDataSection.EventLogSizeBytes);
			this.LoggingLevel = Types.pInt(oAppDataSection.LoggingLevel);
			this.ELogLevel = oAppDataSection.ELogLevel;
		}
	},
	
	updateLogging: function (bEnableLogging, bEnableEventLogging, iLoggingLevel)
	{
		this.EnableLogging = !!bEnableLogging;
		this.EnableEventLogging = !!bEnableEventLogging;
		this.LoggingLevel = Types.pInt(iLoggingLevel);
	},
	
	updateLogsSize: function (iLogSizeBytes, iEventLogSizeBytes)
	{
			this.LogSizeBytes = Types.pInt(iLogSizeBytes);
			this.EventLogSizeBytes = Types.pInt(iEventLogSizeBytes);
	}
};
