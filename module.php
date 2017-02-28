<?php
/**
 * @copyright Copyright (c) 2016, Afterlogic Corp.
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

namespace Aurora\Modules;

class AdminPanelWebclientModule extends \Aurora\System\AbstractModule
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
}
