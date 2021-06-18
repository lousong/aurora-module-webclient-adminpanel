import _ from 'lodash'
import VueCookie from 'vue-cookie'

import UserModel from 'src/classes/user'

import enums from 'src/enums'

export default {
  namespaced: true,

  state: {
    authToken: VueCookie.get('AuthToken') || '',
    userRole: null,
    userPublicId: null,
  },

  mutations: {
    setAuthToken (state, v) {
      state.authToken = v
      VueCookie.set('AuthToken', v)
    },

    setUserData (state, userData) {
      const user = new UserModel(null, userData, userData)
      if (!_.isEmpty(user)) {
        state.userRole = user.role
        state.userPublicId = user.publicId
      }
    },
  },

  actions: {
    parseAppData ({ commit }, appData) {
      commit('setUserData', appData.User)
    },

    setAuthToken ({ commit }, authToken) {
      commit('setAuthToken', authToken)
    },

    logout ({ commit }) {
      commit('setAuthToken', '')
    },
  },

  getters: {
    getAuthToken (state) {
      return state.authToken
    },

    isAuthorized (state) {
      return state.authToken !== ''
    },

    getDataToSave (state) {
      return {
        authToken: state.authToken,
      }
    },

    getUserPublicId (state) {
      return state.userPublicId
    },

    isUserSuperAdmin (state) {
      const UserRoles = enums.getUserRoles()
      return state.userRole === UserRoles.SuperAdmin
    },
  },
}
