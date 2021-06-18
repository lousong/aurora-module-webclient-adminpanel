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
  tenants: [],
  tenantsByIds: null,

  async setAuthToken (authToken) {
    await store.dispatch('user/setAuthToken', authToken)
    await this.requestAppData()
  },

  parseTenantsFromAppData () {
    const adminPanelWebclientData = typesUtils.pObject(this.appData?.AdminPanelWebclient)
    const tenantsData = typesUtils.pArray(adminPanelWebclientData?.Tenants?.Items)
    this.parseTenants(tenantsData)
  },

  parseTenants (tenantsData) {
    console.log('tenantsData', tenantsData)
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
      enums.parseAppData(appData)
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
          if (store.getters['user/isUserSuperAdmin']) {
            this.parseTenantsFromAppData()
          }
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

  requestTenants () {
    return new Promise((resolve, reject) => {
      webApi.sendRequest({
        moduleName: 'Core',
        methodName: 'GetTenants',
      }).then(result => {
        if (_.isObject(result?.Items)) {
          this.parseTenants(result.Items)
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
  requestTenants () {
    return core.requestTenants()
  },
  getCurrentTenantId () {
    return (!_.isEmpty(core.tenants)) ? core.tenants[0].id : 0
  },
  getTenantName (id) {
    const tenant = core.getTenantById(id)
    return typesUtils.pString(tenant?.name)
  },
  getTenants () {
    return core.tenants
  },
}
