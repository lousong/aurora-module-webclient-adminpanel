<?php
/**
 * @copyright Copyright (c) 2017, Afterlogic Corp.
 * @license AGPL-3.0 or AfterLogic Software License
 *
 * This code is licensed under AGPLv3 license or AfterLogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\AdminPanelWebclient;

/**
 * @internal
 */
class Module extends \Aurora\System\Module\AbstractWebclientModule
{
	public function TestDbConnection($DbLogin, $DbName, $DbHost, $DbPassword = null)
	{
		return \Aurora\Modules\Core\Module::Decorator()->TestDbConnection($DbLogin, $DbName, $DbHost, $DbPassword);
	}
	
	public function CreateTables()
	{
		return \Aurora\Modules\Core\Module::Decorator()->CreateTables();
	}
	
	public function GetEntityList($Type, $Search)
	{
		return \Aurora\Modules\Core\Module::Decorator()->GetEntityList($Type, $Search);
	}
	
	public function GetEntity($Type, $Id)
	{
		return \Aurora\Modules\Core\Module::Decorator()->GetEntity($Type, $Id);
	}
	
	public function CreateTenant($ChannelId = 0, $Name = '', $Description = '')
	{
		return \Aurora\Modules\Core\Module::Decorator()->CreateTenant($ChannelId, $Name, $Description);
	}
	
	public function CreateUser($TenantId = 0, $PublicId = '', $Role = \Aurora\System\Enums\UserRole::NormalUser, $WriteSeparateLog = false)
	{
		return \Aurora\Modules\Core\Module::Decorator()->CreateUser($TenantId, $PublicId, $Role, $WriteSeparateLog);
	}
	
	public function UpdateEntity($Type, $Data)
	{
		return \Aurora\Modules\Core\Module::Decorator()->UpdateEntity($Type, $Data);
	}
	
	public function DeleteEntities($Type, $IdList)
	{
		$bResult = true;
		foreach ($IdList as $sId)
		{
			$bResult = $bResult && $this->DeleteEntity($Type, $sId);
		}
		return $bResult;
	}
	
	public function DeleteEntity($Type, $Id)
	{
		return \Aurora\Modules\Core\Module::Decorator()->DeleteEntity($Type, $Id);
	}
	
	public function UpdateSettings(
			$DbLogin = null, $DbPassword = null, $DbName = null, $DbHost = null,
			$AdminLogin = null, $Password = null, $NewPassword = null, $AdminLanguage = null,
			$Language = null, $AutodetectLanguage = null, $TimeFormat = null, $EnableLogging = null,
			$EnableEventLogging = null, $LoggingLevel = null
	)
	{
		return \Aurora\Modules\Core\Module::Decorator()->UpdateSettings(
			$DbLogin, $DbPassword, $DbName, $DbHost,
			$AdminLogin, $Password, $NewPassword, $AdminLanguage,
			$Language, $AutodetectLanguage, $TimeFormat, $EnableLogging,
			$EnableEventLogging, $LoggingLevel
		);
	}
}
