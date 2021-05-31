import VueCookie from 'vue-cookie'

export default {
  namespaced: true,
  state: {
    authToken: VueCookie.get('AuthToken') || '',
    userId: 0,
    userName: '',
    userPublicId: '',
    userRole: 4, // Anonymous
    userTenantId: 0,
  },
  mutations: {
    setAuthToken (state, v) {
      state.authToken = v
      VueCookie.set('AuthToken', v)
    },
    setUserData (state, oUserData) {
      state.userId = oUserData.Id
      state.userName = oUserData.Name
      state.userPublicId = oUserData.PublicId
      state.userRole = oUserData.Role
      state.userTenantId = oUserData.TenantId
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
      return state.userPublicId
    },
    isUserSuperAdmin (state) {
      return state.userRole === 0
    },
  },
}
