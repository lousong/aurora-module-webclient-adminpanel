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
 */

namespace Aurora\Modules\AdminPanelWebclient;

/**
 * @internal
 */
class Module extends \Aurora\System\Module\AbstractWebclientModule
{
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
	
	public function CreateUser($TenantId = 0, $PublicId = '', $Role = \EUserRole::NormalUser, $WriteSeparateLog = false)
	{
		return \Aurora\System\Api::GetModuleDecorator('Core')->CreateUser($TenantId, $PublicId, $Role, $WriteSeparateLog);
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
}
