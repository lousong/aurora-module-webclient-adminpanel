'use strict';

var
	_ = require('underscore'),
	$ = require('jquery'),
	ko = require('knockout'),
	
	Text = require('modules/CoreClient/js/utils/Text.js'),
	
	Routing = require('modules/CoreClient/js/Routing.js'),
	CAbstractScreenView = require('modules/CoreClient/js/views/CAbstractScreenView.js'),
	
	Links = require('modules/%ModuleName%/js/utils/Links.js'),
	
	Settings = require('modules/%ModuleName%/js/Settings.js'),
	CEntitiesView = require('modules/%ModuleName%/js/views/CEntitiesView.js'),
	
	$html = $('html')
;

/**
 * @constructor
 */
function CSettingsView()
{
	CAbstractScreenView.call(this);
	
	this.aEntitiesData = [
		{
			hash: Routing.buildHashFromArray(Links.get('')),
			linkText: Text.i18n('%MODULENAME%/HEADING_SYSTEM_SETTINGS_TABNAME'),
			name: '',
			view: null
		}
	];
	_.each(Settings.Entities, _.bind(function (sEntityName) {
		var
			oData = Settings.EntitiesData[sEntityName],
			oEntity = {
				name: sEntityName,
				hash: Routing.buildHashFromArray(Links.get(sEntityName)),
				linkText: oData ? Text.i18n(oData.linkTextKey) : sEntityName,
				view: new CEntitiesView(sEntityName)
			}
		;
		this.aEntitiesData.push(oEntity);
	}, this));
	this.currentEntityName = ko.observable('');
	this.currentEntitiesId = ko.observable({});
	this.showModulesTabs = ko.computed(function () {
		return this.currentEntityName() === '' || !!this.currentEntitiesId()[this.currentEntityName()];
	}, this);
	
	this.tabs = ko.observableArray([]);
	
	this.currentTab = ko.observable(null);
}

_.extendOwn(CSettingsView.prototype, CAbstractScreenView.prototype);

CSettingsView.prototype.ViewTemplate = '%ModuleName%_SettingsView';

CSettingsView.prototype.registerTab = function (fGetTabView, oTabName, oTabTitle)
{
	if (_.isFunction(fGetTabView))
	{
		var iLastIndex = Settings.TabsOrder.length;

		this.tabs.push({
			view: fGetTabView(),
			name: oTabName,
			title: oTabTitle
		});

		this.tabs(_.sortBy(this.tabs(), function (oTab) {
			var iIndex = _.indexOf(Settings.TabsOrder, oTab.name);
			return iIndex !== -1 ? iIndex : iLastIndex;
		}));
	}
};

CSettingsView.prototype.changeEntity = function (sEntityName, iEntityId)
{
	var oEntitiesId = _.clone(this.currentEntitiesId());
	oEntitiesId[sEntityName] = iEntityId;
	Routing.setHash(Links.get(sEntityName, oEntitiesId, this.currentTab()));
};

CSettingsView.prototype.onShow = function ()
{
	$html.addClass('non-adjustable');
	_.each(this.aEntitiesData, function (oEntity) {
		if (oEntity.view && _.isFunction(oEntity.view.onShow))
		{
			oEntity.view.onShow();
		}
	});
};

CSettingsView.prototype.onHide = function ()
{
	$html.removeClass('non-adjustable');
};

/**
 * @param {Array} aParams
 */
CSettingsView.prototype.onRoute = function (aParams)
{
	var
		oParams = Links.parse(aParams),
		oCurrentEntityData = _.find(this.aEntitiesData, function (oData) {
			return oData.name === oParams.Current;
		})
	;
	this.currentEntityName(oParams.Current);
	this.currentEntitiesId(oParams.Entities);
	if (oCurrentEntityData && oCurrentEntityData.view)
	{
		oCurrentEntityData.view.changeEntity(oParams.Entities[oParams.Current]);
	}
	
	_.each(this.tabs(), function (oTab) {
		if (oTab.view && _.isFunction(oTab.view.setAccessLevel))
		{
			oTab.view.setAccessLevel(oParams.Current, oParams.Entities[oParams.Current]);
		}
	});
	this.onTabsRoute([oParams.Last]);
};

CSettingsView.prototype.onTabsRoute = function (aParams)
{
	var
		sNewTabName = aParams.shift(),
		oCurrentTab = this.currentTab(),
		oNewTab = _.find(this.tabs(), function (oTab) {
			return oTab.name === sNewTabName;
		}),
		fShowNewTab = function () {
			if (oNewTab)
			{
				if ($.isFunction(oNewTab.view.onRoute))
				{
					oNewTab.view.onRoute(aParams);
				}
				this.currentTab(oNewTab);
			}
		}.bind(this),
		fRevertRouting = _.bind(function () {
			if (oCurrentTab)
			{
//				Routing.replaceHashDirectly([Settings.HashModuleName, oCurrentTab.name]);
			}
		}, this),
		bShow = true
	;
	
	if (oNewTab && oNewTab.view.visible())
	{
		if (oCurrentTab && $.isFunction(oCurrentTab.view.hide))
		{
			oCurrentTab.view.hide(fShowNewTab, fRevertRouting);
			bShow = false;
		}
	}
	else if (!oCurrentTab)
	{
		oNewTab = _.find(this.tabs(), function (oTab) {
			return oTab.name === 'common' && oTab.view.visible();
		});
		
		if (!oNewTab)
		{
			oNewTab = _.find(this.tabs(), function (oTab) {
				return oTab.view.visible();
			});
		}
	}
	
	if (bShow)
	{
		fShowNewTab();
	}
};

/**
 * @param {string} sTabName
 */
CSettingsView.prototype.changeTab = function (sTabName)
{
	Routing.setHash(Links.get(this.currentEntityName(), this.currentEntitiesId(), sTabName));
};

///**
// * @param {Array} aAddHash
// */
//CSettingsView.prototype.setAddHash = function (aAddHash)
//{
//	Routing.setHash(_.union([Settings.HashModuleName, this.currentTab() ? this.currentTab().name : ''], aAddHash));
//};

module.exports = new CSettingsView();
