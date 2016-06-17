'use strict';

var $ = require('jquery');

$('body').ready(function () {

	var
		oAvaliableModules = {
			'AdminPanelClient': require('modules/AdminPanelClient/js/manager.js'),
			'FilesClient': require('modules/FilesClient/js/manager.js')
		},
		ModulesManager = require('modules/CoreClient/js/ModulesManager.js'),
		App = require('modules/CoreClient/js/App.js')
	;
	
	ModulesManager.init(oAvaliableModules, App.getUserRole(), App.isPublic());
	App.init();
});