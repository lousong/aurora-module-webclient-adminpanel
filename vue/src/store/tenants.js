import _ from 'lodash'
import store from 'src/store'

import errors from 'src/utils/errors'
import notification from 'src/utils/notification'
import typesUtils from 'src/utils/types'
import webApi from 'src/utils/web-api'

import TenantModel from 'src/classes/tenant'

export default {
  namespaced: true,

  state: {
    tenants: [],
    currentTenantId: null,
  },

  mutations: {
    setTenants (state, { tenants, totalCount, search, page, limit }) {
      state.tenants = tenants
      if (tenants.length === 0) {
        state.currentTenantId = null
      } else if (!tenants.find(tenant => tenant.id === state.currentTenantId)) {
        state.currentTenantId = tenants[0].id
      }
    },

    setCurrentTenantId (state, tenantId) {
      state.currentTenantId = tenantId
    },
  },

  actions: {
    requestTenants ({ commit }, params = {}) {
      if (store.getters['user/isUserSuperAdmin']) {
        const { page = 1, limit = 0, search = '' } = params
        webApi.sendRequest({
          moduleName: 'Core',
          methodName: 'GetTenants',
          parameters: {
            Offset: limit * (page - 1),
            Limit: limit,
            Search: search
          },
        }).then(result => {
          if (_.isArray(result?.Items)) {
            const tenants = _.map(result.Items, function (serverData) {
              return new TenantModel(serverData)
            })
            const totalCount = typesUtils.pInt(result.Count)
            commit('setTenants', { tenants, totalCount, search, page, limit })
          }
        }, response => {
          notification.showError(errors.getTextFromResponse(response))
        })
      }
    },
  },

  getters: {
    getTenants (state) {
      return state.tenants
    },

    getCurrentTenantId (state) {
      return state.currentTenantId
    },
  },
}
