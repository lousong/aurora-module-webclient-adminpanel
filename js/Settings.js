'use strict';

var Types = require('modules/CoreClient/js/utils/Types.js');

module.exports = {
	HashModuleName: 'admin',
	
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