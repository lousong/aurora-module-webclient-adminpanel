'use strict';

var
	_ = require('underscore'),
	
	Types = require('modules/CoreClient/js/utils/Types.js'),
	
	Settings = require('modules/%ModuleName%/js/Settings.js'),
	
	LinksUtils = {}
;

/**
 * @param {Array=} aEntities
 * @param {string=} sCurrEntity = ''
 * @return {Array}
 */
LinksUtils.get = function (sCurrEntity, aEntities, sLast)
{
	var aResult = [Settings.HashModuleName];
	
	aEntities = aEntities || [];
	
	_.each(Settings.Entities, function (sEntityName) {
		if (Types.isPositiveNumber(aEntities[sEntityName]))
		{
			aResult.push(sEntityName.substr(0,1) + aEntities[sEntityName]);
		}
		else if (sCurrEntity === sEntityName)
		{
			aResult.push(sEntityName);
		}
	});
	
	if (Types.isNonEmptyString(sLast))
	{
		aResult.push(sLast);
	}
	
	return aResult;
};

/**
 * @param {Array} aParams
 * 
 * @return {Object}
 */
LinksUtils.parse = function (aParams)
{
	var
		iIndex = 0,
		oEntities = {},
		sCurrEntity = ''
	;
	
	_.each(Settings.Entities, function (sEntity) {
		if (aParams[iIndex] && sEntity === aParams[iIndex])
		{
			sCurrEntity = sEntity;
			iIndex++;
		}
		if (aParams[iIndex] && sEntity.substr(0, 1) === aParams[iIndex].substr(0, 1) && Types.pInt(aParams[iIndex].substr(1)) > 0)
		{
			oEntities[sEntity] = Types.pInt(aParams[iIndex].substr(1));
			sCurrEntity = sEntity;
			iIndex++;
		}
	});
	
	return {
		Entities: oEntities,
		Current: sCurrEntity,
		Last: Types.isNonEmptyString(aParams[iIndex]) ? aParams[iIndex] : ''
	};
};

module.exports = LinksUtils;
