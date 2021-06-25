import typesUtils from 'src/utils/types'
import _ from 'lodash'

class TenantModel {
  constructor (tenantId, name, siteName, completeData = null) {
    this.id = typesUtils.pInt(tenantId)
    this.name = typesUtils.pString(name)
    this.siteName = typesUtils.pString(siteName)
    this.brandingData = {}
    this.setCompleteData(completeData)
  }

  setCompleteData (data) {
    if (_.isEmpty(this.completeData)) {
      this.completeData = {}
    }
    if (_.isObject(data)) {
      this.completeData = _.extend(this.completeData, data)
    }
  }

  update (name, siteName, completeData) {
    this.name = typesUtils.pString(name)
    this.siteName = typesUtils.pString(siteName)

    this.setCompleteData(completeData)
  }

  setBrandingData (brandingData) {
    this.brandingData = brandingData
  }

  getData (field) {
    return this.completeData && this.completeData[field]
  }
}

export default TenantModel
