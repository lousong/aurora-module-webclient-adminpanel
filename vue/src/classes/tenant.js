import typesUtils from 'src/utils/types'

class TenantModel {
  constructor (tenantId, name, siteName, completeData = null) {
    this.id = typesUtils.pInt(tenantId)
    this.name = typesUtils.pString(name)
    this.siteName = typesUtils.pString(siteName)

    this.setCompleteData(completeData)
  }

  setCompleteData (data) {
    this.completeData = data
  }

  update (name, siteName, completeData) {
    this.name = typesUtils.pString(name)
    this.siteName = typesUtils.pString(siteName)

    this.setCompleteData(completeData)
  }
}

export default TenantModel
