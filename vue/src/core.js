import { i18n } from 'src/boot/i18n'

import _ from 'lodash'

import store from 'src/store'

import errors from 'src/utils/errors'
import notification from 'src/utils/notification'
import typesUtils from 'src/utils/types'
import webApi from 'src/utils/web-api'

import modulesManager from 'src/modules-manager'

const core = {
  appData: null,
  tenants: [],
  tenantsByIds: null,

  parseTenants () {
    const adminPanelWebclientData = typesUtils.pObject(this.appData?.AdminPanelWebclient)
    const tenantsData = typesUtils.pArray(adminPanelWebclientData?.Tenants?.Items)
    const tenants = []
    tenantsData.forEach(data => {
      tenants.push({
        id: typesUtils.pInt(data.Id),
        name: typesUtils.pString(data.Name),
        siteName: typesUtils.pString(data.SiteName),
      })
    })
    this.tenants = tenants
  },

  getTenantById (id) {
    if (this.tenantsByIds === null) {
      this.tenantsByIds = {}
      this.tenants.forEach(tenant => {
        this.tenantsByIds[tenant.id] = tenant
      })
    }
    return typesUtils.pObject(this.tenantsByIds[id], null)
  },

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
          this.parseTenants()
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
  getTenantName (id) {
    const tenant = core.getTenantById(id)
    return typesUtils.pString(tenant?.name)
  },
}
