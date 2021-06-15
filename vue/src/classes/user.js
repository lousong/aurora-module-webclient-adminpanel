import typesUtils from 'src/utils/types'

class UserModel {
  constructor(serverData) {
    this.id = typesUtils.pInt(serverData?.Id)
    this.name = typesUtils.pString(serverData?.Name)
    this.publicId = typesUtils.pString(serverData?.PublicId)
    this.uuid = typesUtils.pString(serverData?.UUID)
  }
}

export default UserModel
