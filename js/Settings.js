'use strict';

var Types = require('modules/CoreClient/js/utils/Types.js');

module.exports = {
	ServerModuleName: 'Core',
	HashModuleName: 'admin',
	
	Entities: ['tenants', 'users'],
	EntitiesData: {
		'tenants': {
			linkTextKey: '%MODULENAME%/HEADING_TENANTS_SETTINGS_TABNAME',
			objectName: 'Tenant'
		},
		'users': {
			linkTextKey: '%MODULENAME%/HEADING_USERS_SETTINGS_TABNAME',
			objectName: 'User'
		}
	},
	
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