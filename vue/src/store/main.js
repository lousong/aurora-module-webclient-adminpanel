export default {
  namespaced: true,
  state: {
    siteName: '',
  },
  mutations: {
    setSiteName (state, siteName) {
      state.siteName = siteName
    },
  },
  actions: {
    login ({ commit }, authToken) {
      commit('setAuthToken', authToken)
    },
  },
  getters: {
    getApiHost (state) {
      return process.env.API || ''
    },
    getSiteName (state) {
      return state.siteName
    },
  },
}
