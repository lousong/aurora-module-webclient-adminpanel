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

  actions: { },

  getters: {
    getApiHost (state) {
      return process.env.API || ''
    },

    getSiteName (state) {
      return state.siteName
    },
  },
}
