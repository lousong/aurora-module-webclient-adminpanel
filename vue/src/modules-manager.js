import _ from 'lodash'

import typesUtils from 'src/utils/types'

import moduleList from 'src/modules'

let allModules = null
let allModulesNames = []
let systemTabs = null
let availableModules = []

export default {
  async getModules (appData) {
    if (allModules === null) {
      const availableClientModules = typesUtils.pArray(appData?.Core?.AvailableClientModules)
      const availableBackendModules = typesUtils.pArray(appData?.Core?.AvailableBackendModules)
      availableModules = _.uniq(availableClientModules.concat(availableBackendModules))
      // console.log('availableModules', availableModules)
      let modules = await moduleList.getModules()
      // console.log('modules', modules)
      if (_.isArray(modules)) {
        modules = modules.map(module => {
          return _.isObject(module.default) ? module.default : null
        })
        allModules = modules.filter(module => {
          if (_.isObject(module)) {
            const isAvailable = availableModules.indexOf(module.moduleName) !== -1
            const isEveryRequireAvailable = _.isArray(module.requiredModules)
              ? module.requiredModules.every(requiredModuleName => {
                return availableModules.indexOf(requiredModuleName) !== -1
              })
              : true
            // console.log(module.moduleName, isEveryRequireAvailable)
            return isAvailable && isEveryRequireAvailable
          }
          return false
        })
        allModulesNames = allModules.map(module => {
          return module.moduleName
        })
      } else {
        allModules = []
        allModulesNames = []
      }
      // console.log('allModules', allModules)
    }
  },

  initModules (appData) {
    _.each(allModules, oModule => {
      if (_.isFunction(oModule.init)) {
        oModule.init(appData)
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
