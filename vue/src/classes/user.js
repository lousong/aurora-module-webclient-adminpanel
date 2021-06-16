import typesUtils from 'src/utils/types'

import settings from 'src/settings'

const userRoleEnum = settings.getUserRoleEnum()

class UserModel {
  constructor (tenantId, serverData, completeData = null) {
    this.tenantId = tenantId
    this.id = typesUtils.pInt(serverData?.Id)
    this.name = typesUtils.pString(serverData?.Name)
    this.publicId = typesUtils.pString(serverData?.PublicId)
    this.uuid = typesUtils.pString(serverData?.UUID)

    this.setCompleteData(completeData)
  }

  setCompleteData (data) {
    this.completeData = data

    this.role = typesUtils.pEnum(data?.Role, userRoleEnum, userRoleEnum.NormalUser)
    this.writeSeparateLog = typesUtils.pBool(data?.WriteSeparateLog)
  }
}

export default UserModel
