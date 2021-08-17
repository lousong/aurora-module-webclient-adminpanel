import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

import core from 'src/core'
import store from 'src/store'

Vue.use(VueRouter)

const Router = new VueRouter({
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes,

  // Leave these as they are and change in quasar.conf.js instead!
  // quasar.conf.js -> build -> vueRouterMode
  // quasar.conf.js -> build -> publicPath
  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE
})

Router.beforeEach((to, from, next) => {
  core.init().then(() => {
    if (to.name === 'logout') {
      core.logout()
    } else if (to.name !== 'login' && !store.getters['user/isUserSuperAdmin']) {
      next({ name: 'login' })
    } else {
      next()
    }
  }, (error) => {
    console.log('core.init reject', error)
  })
})

export default Router
