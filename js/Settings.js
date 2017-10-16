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
	
	EntitiesPerPage: 20,
	TabsOrder: ['licensing', 'admin-security', 'admin-db', 'logs-viewer', 'system', 'common', 'modules', 'mail', 'mail-domains', 'mail-accounts', 'mail-servers', 'contacts', 'calendar', 'files', 'mobilesync', 'outlooksync', 'helpdesk', 'openpgp'],
	
	init: function (oAppDataSection) {
		if (oAppDataSection)
		{
			var iEntitiesPerPage = Types.pInt(oAppDataSection.EntitiesPerPage);
			if (iEntitiesPerPage > 0)
			{
				this.EntitiesPerPage = iEntitiesPerPage;
			}
			
			if (Types.isNonEmptyArray(oAppDataSection.TabsOrder))
			{
				this.TabsOrder = oAppDataSection.TabsOrder;
			}
		}
	}
};
