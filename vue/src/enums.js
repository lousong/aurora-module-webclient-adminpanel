import _ from 'lodash'

import typesUtils from 'src/utils/types'

const enums = {
  UserRoles: {},

  parseAppData (appData) {
    const coreData = typesUtils.pObject(appData.Core, {})
    if (!_.isEmpty(coreData)) {
      this.UserRoles = typesUtils.pObject(coreData.EUserRole)
    }
  },
}

export default {
  parseAppData: enums.parseAppData.bind(enums),

  getUserRoles () {
    return enums.UserRoles
  },
}
