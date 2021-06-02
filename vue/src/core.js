import { i18n } from 'src/boot/i18n'

import _ from 'lodash'

import store from 'src/store'

import errors from 'src/utils/errors'
import notification from 'src/utils/notification'
import webApi from 'src/utils/web-api'

import modulesManager from 'src/modules-manager'

const core = {
  appData: null,

  setAppData (appData) {
    return new Promise((resolve, reject) => {
      this.appData = appData
      store.dispatch('user/parseAppData', this.appData).then(() => {
        modulesManager.initModules(this.appData)
        resolve()
      }, reject)
      errors.init(appData)
    })
  },

  requestAppData () {
    return new Promise((resolve, reject) => {
      webApi.sendRequest({
        moduleName: 'Core',
        methodName: 'GetAppData',
        parameters: {},
      }).then(result => {
        if (_.isObject(result)) {
          this.setAppData(result).then(resolve, reject)
        } else {
          notification.showError(i18n.tc('COREWEBCLIENT.ERROR_UNKNOWN'))
          reject()
        }
      }, responce => {
        notification.showError(errors.getTextFromResponse(responce, i18n.tc('COREWEBCLIENT.ERROR_UNKNOWN')))
        reject()
      })
    })
  },
}

export default {
  init () {
    return new Promise((resolve, reject) => {
      if (core.appData === null) {
        modulesManager.getModules().then(() => {
          core.requestAppData().then(resolve, reject)
        }, reject)
      } else {
        resolve()
      }
    })
  },
  async setAuthToken (authToken) {
    await store.dispatch('user/setAuthToken', authToken)
    await core.requestAppData()
  },
  getAppData () {
    return core.appData
  },
}
