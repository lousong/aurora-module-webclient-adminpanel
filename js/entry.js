'use strict';

var $ = require('jquery');

$('body').ready(function () {

	var
		oAvaliableModules = {
			'AdminPanelWebclient': require('modules/AdminPanelWebclient/js/manager.js'),
			'FilesWebclient': require('modules/FilesWebclient/js/manager.js')
		},
		ModulesManager = require('modules/CoreClient/js/ModulesManager.js'),
		App = require('modules/CoreClient/js/App.js')
	;
	
	ModulesManager.init(oAvaliableModules, App.getUserRole(), App.isPublic());
	App.init();
});