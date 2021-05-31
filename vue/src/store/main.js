export default {
  namespaced: true,
  state: {
    apiHost: 'https://local.host/p8',
    siteName: '',
  },
  mutations: {
    setApiHost (state, apiHost) {
      state.apiHost = apiHost
    },
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
      return state.apiHost
    },
    getSiteName (state) {
      return state.siteName
    },
  },
}
