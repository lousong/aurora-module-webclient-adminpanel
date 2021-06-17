import VueCookie from 'vue-cookie'

import UserModel from 'src/classes/user'

import enums from 'src/enums'
const UserRoles = enums.getUserRoles()

export default {
  namespaced: true,
  state: {
    authToken: VueCookie.get('AuthToken') || '',
    user: null,
  },
  mutations: {
    setAuthToken (state, v) {
      state.authToken = v
      VueCookie.set('AuthToken', v)
    },
    setUserData (state, oUserData) {
      state.user = new UserModel(null, oUserData)
    },
  },
  actions: {
    parseAppData ({ commit }, oAppData) {
      commit('setUserData', oAppData.User)
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
      return state.user?.publicId || ''
    },
    isUserSuperAdmin (state) {
      return state.user?.role === UserRoles.SuperAdmin
    },
  },
}
