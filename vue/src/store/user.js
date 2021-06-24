import _ from 'lodash'
import VueCookies from 'vue-cookies'

import UserModel from 'src/classes/user'

import enums from 'src/enums'

import settings from 'src/settings'

export default {
  namespaced: true,

  state: {
    authToken: VueCookies.get('AuthToken') || '',
    userRole: null,
    userPublicId: null,
  },

  mutations: {
    setAuthToken (state, authToken) {
      const cookieSettings = settings.getCookieSettings()
      const expire = cookieSettings.authTokenCookieExpireTime > 0 ? cookieSettings.authTokenCookieExpireTime + 'd' : ''
      if (_.isEmpty(authToken)) {
        VueCookies.remove('AuthToken')
      } else {
        VueCookies.set('AuthToken', authToken, expire)
      }
      state.authToken = authToken
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
