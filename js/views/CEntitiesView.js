'use strict';

var
	ko = require('knockout'),
	
	Ajax = require('modules/%ModuleName%/js/Ajax.js'),
	Settings = require('modules/%ModuleName%/js/Settings.js')
;

/**
 * @param {string} sEntityName
 * @constructor
 */
function CEntitiesView(sEntityName)
{
	this.sName = sEntityName;
	this.sType = Settings.EntitiesData[sEntityName] ? Settings.EntitiesData[sEntityName].objectName : sEntityName;
	this.entities = ko.observableArray([]);
	this.current = ko.observable(0);
}

CEntitiesView.prototype.ViewTemplate = '%ModuleName%_EntitiesView';

CEntitiesView.prototype.onShow = function ()
{
	Ajax.send('GetEntities', {Type: this.sType}, function (oResponse) {
		this.entities(oResponse.Result);
	}, this);
};

CEntitiesView.prototype.changeEntity = function (iId)
{
	this.current(iId);
};

module.exports = CEntitiesView;
