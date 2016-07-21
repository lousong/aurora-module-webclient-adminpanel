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
 * Constructor of admin panel settings view.
 * 
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
		var
			oView = new CEntitiesView(oEntityData.Type),
			fChangeEntity = _.bind(function (sType, iEntityId, sTabName) {
				if (sTabName === 'create')
				{
					this.createEntity();
				}
				else if (sType === this.currentEntityType())
				{
					this.changeEntity(sType, iEntityId, sTabName || '');
				}
			}, this)
		;
		
		oView.setChangeEntityHandler(fChangeEntity);
		
		this.aScreens.push({
			sHash: Routing.buildHashFromArray(Links.get(oEntityData.Type)),
			sLinkText: Text.i18n(oEntityData.LinkTextKey),
			sType: oEntityData.Type,
			oView: oView
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
	this.currentEntitiesView.subscribe(function () {
		if (this.currentEntitiesView())
		{
			this.currentEntitiesView().onShow();
		}
	}, this);
	this.showModulesTabs = ko.computed(function () {
		return this.currentEntityType() === '' || this.currentEntitiesView().hasSelectedEntity();
	}, this);
	
	this.tabs = ko.observableArray([]);
	
	this.currentTab = ko.observable(null);
}

_.extendOwn(CSettingsView.prototype, CAbstractScreenView.prototype);

CSettingsView.prototype.ViewTemplate = '%ModuleName%_SettingsView';

/**
 * Registers admin panel tab.
 * 
 * @param {Function} fGetTabView Function that return view model of the tab.
 * @param {Object} oTabName Tab name.
 * @param {Object} oTabTitle Tab title.
 */
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

/**
 * Sets hash without creating entity.
 */
CSettingsView.prototype.cancelCreatingEntity = function ()
{
	Routing.setHash(Links.get(this.currentEntityType(), {}, ''));
};

/**
 * Sets hash for creating entity.
 */
CSettingsView.prototype.createEntity = function ()
{
	Routing.setHash(Links.get(this.currentEntityType(), {}, 'create'));
};

/**
 * Sets hash to route to screen with specified entity type and|or entity identificator and|or settings tab.
 * 
 * @param {string} sEntityName Entity type to display.
 * @param {number} iEntityId Identificator of entity to display.
 * @param {string} sTabName Name of settings tab to display.
 */
CSettingsView.prototype.changeEntity = function (sEntityName, iEntityId, sTabName)
{
	var
		oEntitiesId = _.clone(this.currentEntitiesId()),
		bHasTab = !!_.find(this.tabs(), function (oTab) {
			return oTab.name === sTabName;
		}),
		sCurrTabName = this.currentTab() ? this.currentTab().name : ''
	;
	oEntitiesId[sEntityName] = iEntityId;
	Routing.setHash(Links.get(sEntityName, oEntitiesId, bHasTab ? sTabName : sCurrTabName));
};

CSettingsView.prototype.onShow = function ()
{
//	$html.addClass('non-adjustable');
};

CSettingsView.prototype.onHide = function ()
{
//	$html.removeClass('non-adjustable');
};

/**
 * Parses parameters from url hash, hides current admin panel tab if nessessary and after that finds a new one and shows it.
 * 
 * @param {Array} aParams Parameters from url hash.
 */
CSettingsView.prototype.onRoute = function (aParams)
{
	var
		oParams = Links.parse(aParams),
		bSameType = this.currentEntityType() === oParams.CurrentType,
		bSameId = this.currentEntitiesId()[oParams.CurrentType] === oParams.Entities[oParams.CurrentType],
		bSameTab = this.currentTab() && this.currentTab().name === oParams.Last,
		oCurrentTab = this.currentTab(),
		fAfterTabHide = _.bind(function () {
			this.showNewScreenView(oParams);
			this.showNewTabView(oParams.Last); // only after showing new entities view
		}, this),
		fAfterRefuseTabHide = _.bind(function () {
			if (oCurrentTab)
			{
				Routing.replaceHashDirectly(Links.get(this.currentEntityType(), this.currentEntitiesId(), this.currentTab() ? this.currentTab().name : ''));
			}
		}, this)
	;
	
	if (!bSameType || !bSameId || !bSameTab)
	{
		if (oCurrentTab && $.isFunction(oCurrentTab.view.hide))
		{
			oCurrentTab.view.hide(fAfterTabHide, fAfterRefuseTabHide);
		}
		else
		{
			fAfterTabHide();
		}
	}
};

/**
 * Shows new screen view.
 * 
 * @param {Object} oParams Parameters with information about new screen.
 */
CSettingsView.prototype.showNewScreenView = function (oParams)
{
	var
		oCurrentEntityData = _.find(this.aScreens, function (oData) {
			return oData.sType === oParams.CurrentType;
		})
	;
	
	this.currentEntityType(oParams.CurrentType);
	this.currentEntitiesId(oParams.Entities);

	if (oCurrentEntityData && oCurrentEntityData.oView)
	{
		if (oParams.Last === 'create')
		{
			oCurrentEntityData.oView.openCreateForm();
		}
		else
		{
			oCurrentEntityData.oView.cancelCreatingEntity();
		}
		oCurrentEntityData.oView.changeEntity(oParams.Entities[oParams.CurrentType]);
	}
};

/**
 * Shows tab with specified tab name. Should be called only after calling showNewScreenView method.
 * 
 * @param {string} sNewTabName New tab name.
 */
CSettingsView.prototype.showNewTabView = function (sNewTabName)
{
	// Sets access level to all tabs so they can correct their visibilities
	_.each(this.tabs(), _.bind(function (oTab) {
		if (oTab.view && _.isFunction(oTab.view.setAccessLevel))
		{
			oTab.view.setAccessLevel(this.currentEntityType(), this.currentEntitiesId()[this.currentEntityType()]);
		}
	}, this));
	
	// Finds tab with name from the url hash
	var oNewTab = _.find(this.tabs(), function (oTab) {
		return oTab.name === sNewTabName;
	});
	
	// If the tab wasn't found finds the first avaliable visible tab
	if (!oNewTab || !(oNewTab.view && oNewTab.view.visible()))
	{
		oNewTab = _.find(this.tabs(), function (oTab) {
			return oTab.view && oTab.view.visible();
		});
	}
	
	// If tab was found calls its onRoute function and sets new current tab
	if (oNewTab)
	{
		if ($.isFunction(oNewTab.view.onRoute))
		{
			oNewTab.view.onRoute();
		}
		this.currentTab(oNewTab);
	}
};

/**
 * Sets hash for showing another admin panel tab.
 * 
 * @param {string} sTabName Tab name.
 */
CSettingsView.prototype.changeTab = function (sTabName)
{
	Routing.setHash(Links.get(this.currentEntityType(), this.currentEntitiesId(), sTabName));
};

/**
 * Calls logout function of application.
 */
CSettingsView.prototype.logout = function ()
{
	App.logout();
};

/**
 * Deletes current entity.
 */
CSettingsView.prototype.deleteCurrentEntity = function ()
{
	if (this.currentEntitiesView())
	{
		this.currentEntitiesView().deleteCurrentEntity();
	}
};

module.exports = new CSettingsView();
