import Vue from 'vue'
import Vuex from 'vuex'

import user from './user'
import main from './main'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    main,
    user,
  },

  strict: process.env.DEV
})
