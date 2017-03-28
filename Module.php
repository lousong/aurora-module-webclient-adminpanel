<?php
/**
 * @copyright Copyright (c) 2017, Afterlogic Corp.
 * @license AGPL-3.0
 *
 * This code is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License, version 3,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License, version 3,
 * along with this program.  If not, see <http://www.gnu.org/licenses/>
 * 
 * @internal
 */

namespace Aurora\Modules\AdminPanelWebclient;

class Module extends \Aurora\System\Module\AbstractWebclientModule
{
	
	public function init() 
	{
		$this->AddEntry('adminpanel', 'EntryAdminpanel');
	}
	
	public function EntryAdminpanel()
	{
//		\Aurora\System\Api::checkUserRoleIsAtLeast(\EUserRole::TenantAdmin);
		
		$sResult = '';
		$oApiIntegrator = \Aurora\System\Api::GetSystemManager('integrator');

		if ($oApiIntegrator)
		{
			$oCoreClientModule = \Aurora\System\Api::GetModule('CoreWebclient');
			if ($oCoreClientModule instanceof \Aurora\System\Module\AbstractModule) 
			{
				$sResult = \file_get_contents($oCoreClientModule->GetPath().'/templates/Index.html');
				if (\is_string($sResult)) 
				{
					$oSettings =& \Aurora\System\Api::GetSettings();
					$sFrameOptions = $oSettings->GetConf('XFrameOptions', '');
					if (0 < \strlen($sFrameOptions)) 
					{
						@\header('X-Frame-Options: '.$sFrameOptions);
					}

					$aConfig = array(
						'public_app' => false,
						'modules_list' => array("AdminPanelWebclient")
					);

					$sResult = \strtr($sResult, array(
						'{{AppVersion}}' => AURORA_APP_VERSION,
						'{{IntegratorDir}}' => $oApiIntegrator->isRtl() ? 'rtl' : 'ltr',
						'{{IntegratorLinks}}' => $oApiIntegrator->buildHeadersLink(),
						'{{IntegratorBody}}' => $oApiIntegrator->buildBody($aConfig)
					));
				}
			}
		}

		return $sResult;
	}
	
	public function TestDbConnection($DbLogin, $DbName, $DbHost, $DbPassword = null)
	{
		return \Aurora\System\Api::GetModuleDecorator('Core')->TestDbConnection($DbLogin, $DbName, $DbHost, $DbPassword);
	}
	
	public function CreateTables()
	{
		return \Aurora\System\Api::GetModuleDecorator('Core')->CreateTables();
	}
	
	public function GetEntityList($Type)
	{
		return \Aurora\System\Api::GetModuleDecorator('Core')->GetEntityList($Type);
	}
	
	public function GetEntity($Type, $Id)
	{
		return \Aurora\System\Api::GetModuleDecorator('Core')->GetEntity($Type, $Id);
	}
	
	public function CreateTenant($ChannelId = 0, $Name = '', $Description = '')
	{
		return \Aurora\System\Api::GetModuleDecorator('Core')->CreateTenant($ChannelId, $Name, $Description);
	}
	
	public function CreateUser($TenantId = 0, $PublicId = '', $Role = \EUserRole::NormalUser)
	{
		return \Aurora\System\Api::GetModuleDecorator('Core')->CreateUser($TenantId, $PublicId, $Role);
	}
	
	public function UpdateEntity($Type, $Data)
	{
		return \Aurora\System\Api::GetModuleDecorator('Core')->UpdateEntity($Type, $Data);
	}
	
	public function DeleteEntity($Type, $Id)
	{
		return \Aurora\System\Api::GetModuleDecorator('Core')->DeleteEntity($Type, $Id);
	}
	
	public function UpdateSettings($LicenseKey = null, $DbLogin = null,
			$DbPassword = null, $DbName = null, $DbHost = null,
			$AdminLogin = null, $Password = null, $NewPassword = null,
			$Language = null, $TimeFormat = null, $EnableLogging = null,
			$EnableEventLogging = null, $LoggingLevel = null)
	{
		return \Aurora\System\Api::GetModuleDecorator('Core')->UpdateSettings($LicenseKey, $DbLogin,
			$DbPassword, $DbName, $DbHost,
			$AdminLogin, $Password, $NewPassword,
			$Language, $TimeFormat, $EnableLogging,
			$EnableEventLogging, $LoggingLevel);
	}
	
	public function GetLogFilesSize()
	{
		return \Aurora\System\Api::GetModuleDecorator('Core')->GetLogFilesSize();
	}
	
	public function GetLogFile($EventsLog)
	{
		return \Aurora\System\Api::GetModuleDecorator('Core')->GetLogFile($EventsLog);
	}
	
	public function GetLog($EventsLog, $PartSize = 10240)
	{
		return \Aurora\System\Api::GetModuleDecorator('Core')->GetLog($EventsLog, $PartSize);
	}
	
	public function ClearLog($EventsLog)
	{
		return \Aurora\System\Api::GetModuleDecorator('Core')->ClearLog($EventsLog);
	}
}
