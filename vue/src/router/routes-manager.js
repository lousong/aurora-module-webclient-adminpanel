import router from 'src/router'

import modulesManager from 'src/modules-manager'

import EditUser from 'src/components/EditUser'
import Empty from 'src/components/Empty'

export default {
  initRoutes () {
    this.addUserRoutes()
    this.addUserFiltersRoutes()
  },

  addUserRoutes (filterRoutePart = '') {
    if (filterRoutePart === '') {
      router.addRoute('users', { path: 'create', component: EditUser })
    }
    router.addRoute('users', { path: filterRoutePart + 'create', component: EditUser })
    router.addRoute('users', { path: filterRoutePart + 'id/:id', component: EditUser })
    router.addRoute('users', { path: filterRoutePart + 'search/:search', component: Empty })
    router.addRoute('users', { path: filterRoutePart + 'search/:search/id/:id', component: EditUser })
    router.addRoute('users', { path: filterRoutePart + 'page/:page', component: Empty })
    router.addRoute('users', { path: filterRoutePart + 'page/:page/id/:id', component: EditUser })
    router.addRoute('users', { path: filterRoutePart + 'search/:search/page/:page', component: Empty })
    router.addRoute('users', { path: filterRoutePart + 'search/:search/page/:page/id/:id', component: EditUser })
  },

  async addUserFiltersRoutes () {
    const filters = await modulesManager.getFiltersForUsers()
    filters.forEach(filterComponent => {
      router.addRoute('users', { path: filterComponent.filterRoute, component: Empty })
      this.addUserRoutes(filterComponent.filterRoute + '/')
    })
    if (filters.length > 1) {
      filters.forEach(filterComponent1 => {
        filters.forEach(filterComponent2 => {
          if (filterComponent1.filterRoute !== filterComponent2.filterRoute) {
            const path = filterComponent1.filterRoute + '/' + filterComponent2.filterRoute
            router.addRoute('users', { path, component: Empty })
            this.addUserRoutes(path + '/')
          }
        })
      })
    }
    // TODO: if there are more than 2 filters
  },
}
