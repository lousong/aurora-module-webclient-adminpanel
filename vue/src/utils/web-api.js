import _ from 'lodash'
import axios from 'axios'
import { saveAs } from 'file-saver'
import VueCookies from 'vue-cookies'

import errors from 'src/utils/errors'
import typesUtils from 'src/utils/types'
import urlUtils from 'src/utils/url'

import core from 'src/core'
import eventBus from 'src/event-bus'
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
        apiHost = urlUtils.getAppPath()
      }
      apiHost = apiHost.replace(/\/$/, '')
      const url = apiHost + '/?/Api/'

      eventBus.$emit('webApi::Request::before', parameters)

      const data = new FormData()
      data.set('Module', moduleName)
      data.set('Method', methodName)
      data.set('Parameters', JSON.stringify(parameters))
      if (format) {
        data.set('Format', format)
      }
      // const authToken = store.getters['user/getAuthToken']
      const authToken = VueCookies.get('AuthToken')
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
          const isOkResponse = response?.status === 200 && !!response?.data
          if (isOkResponse) {
            eventBus.$emit('webApi::Response', { moduleName, methodName, parameters, response: response.data })
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
            eventBus.$emit('webApi::Response', { moduleName, methodName, parameters, response: unknownError })
            reject(unknownError)
          }
        }, () => {
          eventBus.$emit('webApi::Response', { moduleName, methodName, parameters, response: unknownError })
          reject(unknownError)
        })
        .catch((error) => {
          const errorResponse = _.extend(unknownError, { ErrorMessage: error.message })
          eventBus.$emit('webApi::Response', { moduleName, methodName, parameters, response: errorResponse })
          reject(errorResponse)
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
