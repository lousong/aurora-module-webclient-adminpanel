'use strict';

var Types = require('modules/CoreClient/js/utils/Types.js');

module.exports = {
	ServerModuleName: 'Core',
	HashModuleName: 'admin',
	
	EntitiesData: [
		{
			Type: 'Tenant',
			ScreenHash: 'tenants',
			LinkTextKey: '%MODULENAME%/HEADING_TENANTS_SETTINGS_TABNAME'
		},
		{
			Type: 'User',
			ScreenHash: 'users',
			LinkTextKey: '%MODULENAME%/HEADING_USERS_SETTINGS_TABNAME'
		}
	],
	
	TabsOrder: ['core-licensing', 'core-db', 'core-security', 'core-logging', 'common', 'mail', 'mail-domains', 'mail-accounts', 'contacts', 'calendar', 'files', 'mobilesync', 'outlooksync', 'helpdesk', 'openpgp'],
	
	init: function (oAppDataSection) {
		if (oAppDataSection)
		{
			if (Types.isNonEmptyArray(oAppDataSection.TabsOrder))
			{
				this.TabsOrder = oAppDataSection.TabsOrder;
			}
		}
	}
};