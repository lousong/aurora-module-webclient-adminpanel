import _ from 'lodash'

import errors from 'src/utils/errors'
import notification from 'src/utils/notification'
import typesUtils from 'src/utils/types'
import webApi from 'src/utils/web-api'

import UserModel from 'src/classes/user'

export default {
  getUsers (tenantId, search, page, limit) {
    return new Promise((resolve, reject) => {
      webApi.sendRequest({
        moduleName: 'Core',
        methodName: 'GetUsers',
        parameters: {
          TenantId: tenantId,
          Search: search,
          Offset: limit * (page - 1),
          Limit: limit,
        },
      }).then(result => {
        if (_.isArray(result?.Items)) {
          const users = _.map(result.Items, function (serverData) {
            return new UserModel(serverData)
          })
          const totalCount = typesUtils.pInt(result.Count)
          resolve({ users, totalCount, search, page, limit })
        } else {
          resolve({ users: [], totalCount: 0, search, page, limit })
        }
      }, response => {
        notification.showError(errors.getTextFromResponse(response))
        resolve({ users: [], totalCount: 0, search, page, limit })
      })
    })
  },
}
