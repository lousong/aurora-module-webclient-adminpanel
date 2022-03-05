import Vue from 'vue'
import _ from 'lodash'
import store from 'src/store'

import types from 'src/utils/types'
import webApi from 'src/utils/web-api'

import GroupModel from 'src/classes/group'

export default {
  namespaced: true,

  state: {
    groups: [],
    currentGroupId: null,
  },

  mutations: {
    setGroups (state, { groups }) {
      state.groups = groups
      if (groups.length === 0) {
        state.currentGroupId = null
      } else if (!groups.find(group => group.id === state.currentGroupId)) {
        state.currentGroupId = groups[0].id
      }
    },

    setCurrentGroupId (state, groupId) {
      state.currentGroupId = groupId
    },

    updateGroup (state, { id, data }) {
      const groupIndex = state.groups.findIndex(group => group.id === id)
      if (groupIndex !== -1) {
        const group = new GroupModel()
        group.copy(state.groups[groupIndex])
        group.update(data.Name, data.SiteName, data)
        Vue.set(state.groups, groupIndex, group)
      }
    },
  },

  actions: {
    parseGroups ({ commit }, groupsServerData) {
      const groups = _.map(groupsServerData, function (serverData) {
        return new GroupModel(serverData)
      })
      commit('setGroups', { groups })
    },

    requestGroups ({ dispatch }) {
      if (store.getters['user/isUserSuperAdmin']) {
        webApi.sendRequest({
          moduleName: 'Core',
          methodName: 'GetGroups',
          parameters: {
            TenantId: store.getters['tenants/getCurrentTenantId']
          },
        }).then(result => {
          console.log('result', result)
          if (_.isArray(result?.Items)) {
            dispatch('parseGroups', result.Items)
          } else {
            dispatch('parseGroups', [])
          }
        }, response => {
          dispatch('parseGroups', [])
          // Do not show error because groups are requested after savind database settings and tables could be not created yet
          // notification.showError(errors.getTextFromResponse(response))
        })
      }
    },
  },

  getters: {
    getGroups (state) {
      return types.pArray(state.groups)
    },

    getCurrentGroupId (state) {
      return state.currentGroupId
    },

    getGroup (state) {
      return (id) => {
        return state.groups.find(group => group.id === id)
      }
    },

    getGroupName (state) {
      return (id) => {
        const group = state.groups.find(group => group.id === id)
        return types.pString(group?.name)
      }
    },
  },
}
