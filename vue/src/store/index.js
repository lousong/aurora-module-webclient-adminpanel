import Vue from 'vue'
import Vuex from 'vuex'

import user from './user'
import main from './main'
import mail from 'src/../../../MailWebclient/vue/store'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    main,
    user,
    mail,
  },

  strict: process.env.DEV
})
