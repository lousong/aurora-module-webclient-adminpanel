import _ from 'lodash'
import axios from 'axios'
import { saveAs } from 'file-saver'

import errors from 'src/utils/errors'
import typesUtils from 'src/utils/types'
import urlUtils from 'src/utils/url'

import core from 'src/core'
import store from 'src/store'

export default {
  sendRequest: function ({ moduleName, methodName, parameters, format }) {
    return new Promise((resolve, reject) => {
      const unknownError = {
        ErrorCode: 0,
        Module: moduleName,
      }

      let apiHost = store.getters['main/getApiHost']
      if (!typesUtils.isNonEmptyString(apiHost)) {
        apiHost = urlUtils.getAppPath().replace('/adminpanel', '')
      }
      const url = apiHost + '/?/Api/'

      const data = new FormData()
      data.set('Module', moduleName)
      data.set('Method', methodName)
      data.set('Parameters', JSON.stringify(parameters))
      if (format) {
        data.set('Format', format)
      }
      const authToken = store.getters['user/getAuthToken']
      const headers = {
        'Content-Type': 'multipart/form-data',
      }
      if (authToken) {
        headers.Authorization = 'Bearer ' + authToken
      }
      axios({
        method: 'post',
        url,
        data,
        headers,
      })
        .then((response) => {
          const isOkResponse = !!response && response.status === 200 && !!response.data
          if (isOkResponse) {
            const result = response.data.Result
            if (!result && (response.data.ErrorCode || response.data.ErrorMessage || response.data.SubscriptionsResult)) {
              if (methodName !== 'Logout' && errors.isAuthError(response.data.ErrorCode)) {
                core.logout()
              } else {
                reject(response.data)
              }
            } else {
              resolve(result)
            }
          } else {
            reject(unknownError)
          }
        }, () => {
          reject(unknownError)
        })
        .catch((error) => {
          reject(_.extend(unknownError, { ErrorMessage: error.message }))
        })
    })
  },
  downloadExportFile: function ({ moduleName, methodName, parameters, fileName, format }) {
    const headers = {
      'Content-Type': 'multipart/form-data',
    }
    const authToken = store.getters['user/getAuthToken']
    const apiHost = store.getters['main/getApiHost']
    const url = typesUtils.isNonEmptyString(apiHost) ? apiHost + '/?/Api/' : '?/Api/'
    const data = new FormData()
    data.set('Module', moduleName)
    data.set('Method', methodName)
    data.set('Parameters', JSON.stringify(parameters))
    if (format) {
      data.set('Format', format)
    }
    if (authToken) {
      headers.Authorization = 'Bearer ' + authToken
    }
    axios({
      method: 'post',
      url,
      data: data,
      headers: headers
    })
      .then((oResponse) => {
        let resData = oResponse.data.split('\n')
        resData.pop()
        resData = resData.join('\n')
        const oBlob = new Blob([resData])
        saveAs(oBlob, fileName)
      })
  }
}
