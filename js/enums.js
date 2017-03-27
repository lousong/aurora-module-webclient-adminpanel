'use strict';

var
	_ = require('underscore'),
	
	Settings = require('modules/%ModuleName%/js/Settings.js'),
	
	Enums = {
		has: function (sEnumName, mFoundValue) {
			return !!_.find(window.Enums[sEnumName], function (mValue) {
				return mFoundValue === mValue;
			});
		}
	}
;

/**
 * @enum {number}
 */
Enums.LogLevel = Settings.ELogLevel;

if (typeof window.Enums === 'undefined')
{
	window.Enums = {};
}

_.extendOwn(window.Enums, Enums);
