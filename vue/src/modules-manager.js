import _ from 'lodash'

import moduleList from 'src/modules'

let allModules = null
let allModulesNames = []
let systemTabs = null

export default {
  async getModules () {
    if (allModules === null) {
      let modules = await moduleList.getModules()
      if (_.isArray(modules)) {
        modules = modules.map(module => {
          return _.isObject(module.default) ? module.default : null
        })
        allModules = modules.filter(module => _.isObject(module))
        allModulesNames = allModules.map(module => {
          return module.name
        })
      } else {
        allModules = []
        allModulesNames = []
      }
    }
  },

  initModules (oAppData) {
    _.each(allModules, oModule => {
      if (_.isFunction(oModule.init)) {
        oModule.init(oAppData)
      }
    })
  },

  getAdminSystemTabs () {
    if (systemTabs === null && allModules !== null) {
      systemTabs = []
      _.each(allModules, oModule => {
        const aModuleSystemTabs = _.isFunction(oModule.getAdminSystemTabs) && oModule.getAdminSystemTabs()
        if (_.isArray(aModuleSystemTabs)) {
          systemTabs = systemTabs.concat(aModuleSystemTabs)
        }
      })
    }
    return systemTabs === null ? [] : systemTabs
  },

  isModuleAvailable (moduleName) {
    return allModulesNames.indexOf(moduleName) !== -1
  },
}
