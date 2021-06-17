import typesUtils from 'src/utils/types'

import enums from 'src/enums'

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

    this.update(data?.Role, data?.WriteSeparateLog)
  }

  update (role, writeSeparateLog) {
    const UserRoles = enums.getUserRoles()
    this.role = typesUtils.pEnum(role, UserRoles, UserRoles.Anonymous)
    this.writeSeparateLog = typesUtils.pBool(writeSeparateLog)
  }
}

export default UserModel
