'use strict';

var
	_ = require('underscore'),
	
	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
	
	Settings = require('modules/%ModuleName%/js/Settings.js')
;

function CEntitiesTabs()
{
	this.aData = [
//		{
//			Type: 'Tenant',
//			ScreenHash: 'tenants',
//			LinkTextKey: '%MODULENAME%/HEADING_TENANTS_SETTINGS_TABNAME',
//			EditView: require('modules/%ModuleName%/js/views/EditTenantView.js'),
//			
//			ServerModuleName: Settings.ServerModuleName,
//			GetListRequest: 'GetEntityList',
//			GetRequest: 'GetEntity',
//			CreateRequest: 'CreateTenant',
//			UpdateRequest: 'UpdateEntity',
//			DeleteRequest: 'DeleteEntities',
//			
//			NoEntitiesFoundText: TextUtils.i18n('%MODULENAME%/INFO_NO_ENTITIES_FOUND_TENANT'),
//			ActionCreateText: TextUtils.i18n('%MODULENAME%/ACTION_CREATE_ENTITY_TENANT'),
//			ReportSuccessCreateText: TextUtils.i18n('%MODULENAME%/REPORT_CREATE_ENTITY_TENANT'),
//			ErrorCreateText: TextUtils.i18n('%MODULENAME%/ERROR_CREATE_ENTITY_TENANT'),
//			CommonSettingsHeadingText: TextUtils.i18n('COREWEBCLIENT/HEADING_COMMON_SETTINGS'),
//			ReportSuccessUpdate: TextUtils.i18n('%MODULENAME%/REPORT_UPDATE_ENTITY_TENANT'),
//			ErrorUpdate: TextUtils.i18n('%MODULENAME%/ERROR_UPDATE_ENTITY_TENANT'),
//			ActionDeleteText: TextUtils.i18n('%MODULENAME%/ACTION_DELETE_TENANT'),
//			ConfirmDeleteLangConst: '%MODULENAME%/CONFIRM_DELETE_TENANT_PLURAL',
//			ReportSuccessDeleteLangConst: '%MODULENAME%/REPORT_DELETE_ENTITIES_TENANT_PLURAL',
//			ErrorDeleteLangConst: '%MODULENAME%/ERROR_DELETE_ENTITIES_TENANT_PLURAL'
//		},
		{
			Type: 'User',
			ScreenHash: 'users',
			LinkTextKey: '%MODULENAME%/HEADING_USERS_SETTINGS_TABNAME',
			EditView: require('modules/%ModuleName%/js/views/EditUserView.js'),
			
			ServerModuleName: Settings.ServerModuleName,
			GetListRequest: 'GetEntityList',
			GetRequest: 'GetEntity',
			CreateRequest: 'CreateUser',
			UpdateRequest: 'UpdateEntity',
			DeleteRequest: 'DeleteEntities',
			
			NoEntitiesFoundText: TextUtils.i18n('%MODULENAME%/INFO_NO_ENTITIES_FOUND_USER'),
			ActionCreateText: TextUtils.i18n('%MODULENAME%/ACTION_CREATE_ENTITY_USER'),
			ReportSuccessCreateText: TextUtils.i18n('%MODULENAME%/REPORT_CREATE_ENTITY_USER'),
			ErrorCreateText: TextUtils.i18n('%MODULENAME%/ERROR_CREATE_ENTITY_USER'),
			CommonSettingsHeadingText: TextUtils.i18n('COREWEBCLIENT/HEADING_COMMON_SETTINGS'),
			ReportSuccessUpdate: TextUtils.i18n('%MODULENAME%/REPORT_UPDATE_ENTITY_USER'),
			ErrorUpdate: TextUtils.i18n('%MODULENAME%/ERROR_UPDATE_ENTITY_USER'),
			ActionDeleteText: TextUtils.i18n('%MODULENAME%/ACTION_DELETE_USER'),
			ConfirmDeleteLangConst: '%MODULENAME%/CONFIRM_DELETE_USER_PLURAL',
			ReportSuccessDeleteLangConst: '%MODULENAME%/REPORT_DELETE_ENTITIES_USER_PLURAL',
			ErrorDeleteLangConst: '%MODULENAME%/ERROR_DELETE_ENTITIES_USER_PLURAL'
		}
	];
}

CEntitiesTabs.prototype.getData = function ()
{
	return this.aData;
};

CEntitiesTabs.prototype.getEntityData = function (sType)
{
	return _.find(this.aData, function (oEntityData) {
		return oEntityData.Type === sType;
	});
};

CEntitiesTabs.prototype.getEditView = function (sType)
{
	var oEntityData = this.getEntityData(sType);
	return oEntityData ? oEntityData.EditView : null;
};

CEntitiesTabs.prototype.registerEntityType = function (oEntityData)
{
	this.aData.push(oEntityData);
};

module.exports = new CEntitiesTabs();
