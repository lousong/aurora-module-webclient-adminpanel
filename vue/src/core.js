import { i18n } from 'src/boot/i18n'

import _ from 'lodash'

import store from 'src/store'
import enums from 'src/enums'

import errors from 'src/utils/errors'
import notification from 'src/utils/notification'
import typesUtils from 'src/utils/types'
import webApi from 'src/utils/web-api'

import modulesManager from 'src/modules-manager'

const core = {
  appData: null,

  async setAuthToken (authToken) {
    await store.dispatch('user/setAuthToken', authToken)
    await this.requestAppData()
  },

  parseTenantsFromAppData () {
    const adminPanelWebclientData = typesUtils.pObject(this.appData?.AdminPanelWebclient)
    const tenantsData = typesUtils.pArray(adminPanelWebclientData?.Tenants?.Items)
    if (tenantsData.length > 0) {
      store.dispatch('tenants/parseTenants')
    } else {
      store.dispatch('tenants/requestTenants')
    }
  },

  setAppData (appData) {
    return new Promise((resolve, reject) => {
      this.appData = appData
      enums.parseAppData(appData)
      errors.init(appData)
      modulesManager.getModules(appData).then(() => {
        store.dispatch('user/parseAppData', appData).then(() => {
          modulesManager.initModules(appData)
          resolve()
        }, reject)
      }, reject)
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
          this.setAppData(result).then(() => {
            if (store.getters['user/isUserSuperAdmin']) {
              this.parseTenantsFromAppData()
            }
            resolve()
          }, reject)
        } else {
          notification.showError(i18n.tc('COREWEBCLIENT.ERROR_UNKNOWN'))
          reject()
        }
      }, response => {
        notification.showError(errors.getTextFromResponse(response, i18n.tc('COREWEBCLIENT.ERROR_UNKNOWN')))
        reject()
      })
    })
  },
}

export default {
  init () {
    return new Promise((resolve, reject) => {
      if (core.appData === null) {
        core.requestAppData().then(resolve, reject)
      } else {
        resolve()
      }
    })
  },
  logout () {
    webApi.sendRequest({
      moduleName: 'Core',
      methodName: 'Logout',
      parameters: {},
    }).then(() => {
      core.setAuthToken('')
    }, () => {
      core.setAuthToken('')
    })
  },
  setAuthToken: core.setAuthToken.bind(core),
  getAppData () {
    return core.appData
  },
}
