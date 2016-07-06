'use strict';

var
	_ = require('underscore'),
	$ = require('jquery'),
	ko = require('knockout'),
	
	Text = require('modules/CoreClient/js/utils/Text.js'),
	
	App = require('modules/CoreClient/js/App.js'),
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
	
	this.aScreens = [
		{
			sHash: Routing.buildHashFromArray(Links.get('')),
			sLinkText: Text.i18n('%MODULENAME%/HEADING_SYSTEM_SETTINGS_TABNAME'),
			sType: '',
			oView: null
		}
	];
	_.each(Settings.EntitiesData, _.bind(function (oEntityData) {
		this.aScreens.push({
			sHash: Routing.buildHashFromArray(Links.get(oEntityData.Type)),
			sLinkText: Text.i18n(oEntityData.LinkTextKey),
			sType: oEntityData.Type,
			oView: new CEntitiesView(oEntityData.Type)
		});
	}, this));
	this.currentEntityType = ko.observable('');
	this.currentEntitiesId = ko.observable({});
	this.currentEntitiesView = ko.computed(function () {
		var
			sCurrType = this.currentEntityType(),
			oCurrEntitiesData = _.find(this.aScreens, function (oData) {
				return oData.sType === sCurrType;
			})
		;
		return oCurrEntitiesData ? oCurrEntitiesData.oView : null;
	}, this);
	this.showModulesTabs = ko.computed(function () {
		return this.currentEntityType() === '' || this.currentEntitiesView().hasSelectedEntity();
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

CSettingsView.prototype.cancelCreatingEntity = function ()
{
	Routing.setHash(Links.get(this.currentEntityType(), {}, ''));
};

CSettingsView.prototype.createEntity = function ()
{
	Routing.setHash(Links.get(this.currentEntityType(), {}, 'create'));
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
	_.each(this.aScreens, function (oEntity) {
		if (oEntity.oView && _.isFunction(oEntity.oView.onShow))
		{
			oEntity.oView.onShow();
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
		oCurrentEntityData = _.find(this.aScreens, function (oData) {
			return oData.sType === oParams.CurrentType;
		})
	;
	this.currentEntityType(oParams.CurrentType);
	this.currentEntitiesId(oParams.Entities);
	if (oCurrentEntityData && oCurrentEntityData.oView)
	{
		oCurrentEntityData.oView.changeEntity(oParams.Entities[oParams.CurrentType]);
		if (oParams.Last === 'create')
		{
			oCurrentEntityData.oView.openCreateForm(_.bind(this.cancelCreatingEntity, this));
		}
		else
		{
			oCurrentEntityData.oView.cancelCreatingEntity();
		}
	}
	
	_.each(this.tabs(), function (oTab) {
		if (oTab.view && _.isFunction(oTab.view.setAccessLevel))
		{
			oTab.view.setAccessLevel(oParams.CurrentType, oParams.Entities[oParams.CurrentType]);
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
	Routing.setHash(Links.get(this.currentEntityType(), this.currentEntitiesId(), sTabName));
};

CSettingsView.prototype.logout = function ()
{
	App.logout();
};

CSettingsView.prototype.deleteCurrentEntity = function ()
{
	if (this.currentEntitiesView())
	{
		this.currentEntitiesView().deleteCurrentEntity();
	}
};

///**
// * @param {Array} aAddHash
// */
//CSettingsView.prototype.setAddHash = function (aAddHash)
//{
//	Routing.setHash(_.union([Settings.HashModuleName, this.currentTab() ? this.currentTab().name : ''], aAddHash));
//};

module.exports = new CSettingsView();
