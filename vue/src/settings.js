import { i18n } from 'boot/i18n'
import axios from 'axios'
import VueCookies from 'vue-cookies'
import store from 'src/store'

import _ from 'lodash'

import notification from 'src/utils/notification'
import typesUtils from 'src/utils/types'
import urlUtils from 'src/utils/url'

import core from 'src/core'

class AdminPanelSettings {
  constructor(appData, settings) {
    const coreData = typesUtils.pObject(appData.Core, {})
    const coreWebclientData = typesUtils.pObject(appData.CoreWebclient, {})
    const coreMobileWebclient = typesUtils.pObject(appData.CoreMobileWebclient, {})
    const appDataSectionLogsViewerWebclient = typesUtils.pObject(appData.LogsViewerWebclient, {})

    if (!_.isEmpty(coreData)) {
      this.enableMultiTenant = typesUtils.pBool(coreData.EnableMultiTenant)
      this.authTokenCookieExpireTime = typesUtils.pInt(coreData.AuthTokenCookieExpireTime, 30)
      this.autodetectLanguage = typesUtils.pBool(coreData.AutodetectLanguage)
      // this.userSelectsDateFormat = typesUtils.pBool(coreData.UserSelectsDateFormat)
      // this.dateFormat = typesUtils.pString(coreData.DateFormat, 'DD/MM/YYYY')
      // this.dateFormatList = typesUtils.pArray(coreData.DateFormatList, ['DD/MM/YYYY'])
      // if (_.indexOf(this.dateFormatList, this.dateFormat) === -1) {
      //   this.dateFormatList.unshift(this.dateFormat)
      // }
      this.isSystemConfigured = typesUtils.pBool(coreData.IsSystemConfigured)
      this.language = typesUtils.pString(coreData.CommonLanguage, 'English')
      // this.lastErrorCode = typesUtils.pInt(coreData.LastErrorCode)
      this.shortLanguage = this._getShortLanguage(coreData)
      this.setSiteName(coreData.SiteName)
      // this.socialName = typesUtils.pString(coreData.SocialName)
      this.storeAuthTokenInDB = typesUtils.pBool(coreData.StoreAuthTokenInDB)
      // this.tenantName = typesUtils.pString(coreData.TenantName || urlUtils.getRequestParam('tenant'))
      this.timeFormat = typesUtils.pString(coreData.TimeFormat) // 0 - 24, 1 - 12
      // this.timezone = typesUtils.pString(coreData.Timezone)
      // this.userId = typesUtils.pInt(coreData.UserId)
      // this.passwordMinLength = typesUtils.pNonNegativeInt(coreData.PasswordMinLength)
      // this.passwordMustBeComplex = typesUtils.pBool(coreData.PasswordMustBeComplex)
      this.cookiePath = typesUtils.pString(coreData.CookiePath)
      if (this.cookiePath === '') {
        this.cookiePath = urlUtils.getAppPath()
      }
      if (process.env.DEV) {
        this.cookiePath = '/'
      }
      this.cookieSecure = typesUtils.pBool(coreData.CookieSecure)
      this.version = typesUtils.pString(coreData.Version)
      this.productName = typesUtils.pString(coreData.ProductName)

      this.enableLogging = typesUtils.pBool(coreData.EnableLogging)
      this.enableEventLogging = typesUtils.pBool(coreData.EnableEventLogging)
      this.loggingLevel = typesUtils.pInt(coreData.LoggingLevel)

      // only for admin
      this.adminHasPassword = typesUtils.pBool(coreData.AdminHasPassword)
      this.adminLanguage = typesUtils.pString(coreData.AdminLanguage)
      this.adminLogin = typesUtils.pString(coreData.AdminLogin)
      // this.commonLanguage = typesUtils.pString(coreData.CommonLanguage)
      this.dbHost = typesUtils.pString(coreData.DBHost)
      this.dbLogin = typesUtils.pString(coreData.DBLogin)
      this.dbName = typesUtils.pString(coreData.DBName)
      this.saltNotEmpty = typesUtils.pBool(coreData.SaltNotEmpty)
    }

    if (!_.isEmpty(coreWebclientData)) {
      // this.allowChangeSettings = typesUtils.pBool(coreWebclientData.AllowChangeSettings)
      // this.allowClientDebug = typesUtils.pBool(coreWebclientData.AllowClientDebug)
      // this.allowDesktopNotifications = typesUtils.pBool(coreWebclientData.AllowDesktopNotifications)
      // this.allowMobile = typesUtils.pBool(coreWebclientData.AllowMobile)
      // this.allowPrefetch = typesUtils.pBool(coreWebclientData.AllowPrefetch, true)
      // this.attachmentSizeLimit = typesUtils.pNonNegativeInt(coreWebclientData.AttachmentSizeLimit)
      // this.autoRefreshIntervalMinutes = typesUtils.pNonNegativeInt(coreWebclientData.AutoRefreshIntervalMinutes)
      // this.customLogoutUrl = typesUtils.pString(coreWebclientData.CustomLogoutUrl)
      // this.defaultAnonymScreenHash = typesUtils.pString(coreWebclientData.DefaultAnonymScreenHash)
      // this.defaultUserScreenHash = typesUtils.pString(coreWebclientData.DefaultUserScreenHash)
      // this.googleAnalyticsAccount = typesUtils.pString(coreWebclientData.GoogleAnalyticsAccount)
      // this.headerModulesOrder = typesUtils.pArray(coreWebclientData.HeaderModulesOrder)
      // this.isDemo = typesUtils.pBool(coreWebclientData.IsDemo)
      // this.isMobile = typesUtils.pInt(coreWebclientData.IsMobile, -1)
      this.languageList = typesUtils.pArray(coreWebclientData.LanguageListWithNames, { name: 'English', text: 'English' })
      // this.multipleFilesUploadLimit = typesUtils.pNonNegativeInt(coreWebclientData.MultipleFilesUploadLimit, 50)
      // this.showQuotaBar = typesUtils.pBool(coreWebclientData.ShowQuotaBar)
      // this.quotaWarningPerc = typesUtils.pInt(coreWebclientData.QuotaWarningPerc)
      this.theme = typesUtils.pString(coreWebclientData.Theme, 'Default')
      this.themeList = typesUtils.pArray(coreWebclientData.ThemeList, ['Default'])
      // this.hideLogout = typesUtils.pBool(coreWebclientData.HideLogout)
    }

    const adminPanelWebclientData = typesUtils.pObject(appData.AdminPanelWebclient)
    this.entitiesOrder = typesUtils.pArray(adminPanelWebclientData.EntitiesOrder)
    this.entitiesPerPage = typesUtils.pInt(adminPanelWebclientData.EntitiesPerPage, 10)
    this.tabsOrder = typesUtils.pArray(adminPanelWebclientData.TabsOrder)

    if (!_.isEmpty(coreMobileWebclient)) {
      this.mobileTheme = typesUtils.pString(coreMobileWebclient.Theme, 'Default')
      this.mobileThemeList = typesUtils.pArray(coreMobileWebclient.ThemeList, ['Default'])
    }
    if (!_.isEmpty(appDataSectionLogsViewerWebclient)) {
      this.viewLastLogSize = typesUtils.pInt(appDataSectionLogsViewerWebclient.ViewLastLogSize)
    }
  }

  showErrorsIfSystemNotConfigured () {
    if (this.isSystemConfigured === false) {
      notification.showError(i18n.tc('COREWEBCLIENT.ERROR_SYSTEM_NOT_CONFIGURED'), 0)
    }
    if (store.getters['user/isUserSuperAdmin']) {
      this.showErrorIfConfigIsAccessible()
      if (!this.adminHasPassword) {
        this.dismissPasswordError = notification.showError(i18n.tc('ADMINPANELWEBCLIENT.ERROR_ADMIN_EMPTY_PASSWORD'), 0)
      }
      if (!this.saltNotEmpty) {
        notification.showError(i18n.tc('ADMINPANELWEBCLIENT.ERROR_SALT_EMPTY'), 0)
      }
      if (this.dbLogin === '' || this.dbHost === '' || this.dbName === '') {
        this.dismissDbError = notification.showError(i18n.tc('ADMINPANELWEBCLIENT.ERROR_DB_ACCESS'), 0)
      }
    }
  }

  showErrorIfConfigIsAccessible () {
    const apiHost = store.getters['main/getApiHost']
    const url = typesUtils.isNonEmptyString(apiHost) ? apiHost + '/data/settings/config.json' : 'data/settings/config.json'
    axios({
      method: 'get',
      url,
    })
      .then((response) => {
        const isOkResponse = !!response && response.status === 200 && !!response.data
        if (isOkResponse) {
          notification.showError(i18n.tc('ADMINPANELWEBCLIENT.ERROR_DATA_FOLDER_ACCESSIBLE_FROM_WEB'), 0)
        }
      })
      .catch((/* error */) => {
        // Do nothing. It is good that config file is not available
      })
  }

  saveAdminAccountData ({ login, password, language }) {
    this.adminLogin = login
    this.adminHasPassword = !_.isEmpty(password)
    if (this.adminHasPassword && _.isFunction(this.dismissPasswordError)) {
      this.dismissPasswordError()
      this.dismissPasswordError = null
    }
    if (this.adminLanguage !== language) {
      this.adminLanguage = language
      window.location.reload()
    }
  }

  saveLoggingData ({ enableLogging, enableEventLogging, loggingLevel }) {
    this.enableLogging = enableLogging
    this.enableEventLogging = enableEventLogging
    this.loggingLevel = loggingLevel
  }

  saveCommonSettingData ({ siteName, theme, mobileTheme, language, timeFormat, autodetectLanguage }) {
    this.setSiteName(siteName)
    this.theme = theme
    this.mobileTheme = mobileTheme
    this.language = language
    this.timeFormat = timeFormat
    this.autodetectLanguage = autodetectLanguage
  }

  setSiteName (siteName) {
    this.siteName = typesUtils.pString(siteName)
    store.commit('main/setSiteName', this.siteName)
  }

  saveDatabaseSetting ({ dbName, dbLogin, dbHost }) {
    this.dbName = dbName
    this.dbLogin = dbLogin
    this.dbHost = dbHost
    if (!_.isEmpty(this.dbLogin) && !_.isEmpty(this.dbHost) && !_.isEmpty(this.dbName) && _.isFunction(this.dismissDbError)) {
      this.dismissDbError()
      this.dismissDbError = null
    }
    core.requestTenants()
  }

  _getShortLanguage (coreData) {
    let shortLanguage = typesUtils.pString(coreData.ShortLanguage, 'en')
    if (_.isEmpty(shortLanguage) || i18n.availableLocales.indexOf(shortLanguage) === -1) {
      if (i18n.availableLocales.indexOf('en') !== -1) {
        shortLanguage = 'en'
      } else if (!_.isEmpty(i18n.availableLocales)) {
        shortLanguage = i18n.availableLocales[0]
      }
    }
    return shortLanguage
  }
}

let settings = null

export default {
  init (appData) {
    settings = new AdminPanelSettings(appData)
    settings.showErrorsIfSystemNotConfigured()
    if (!_.isEmpty(settings.shortLanguage) && i18n.availableLocales.indexOf(settings.shortLanguage) !== -1) {
      i18n.locale = settings.shortLanguage
    }
    VueCookies.config('', settings.cookiePath, '', settings.cookieSecure)
  },

  getEnableMultiTenant () {
    return settings.enableMultiTenant
  },

  getTabsOrder () {
    return settings?.tabsOrder || []
  },

  getEntitiesOrder () {
    return settings.entitiesOrder
  },

  getEntitiesPerPage () {
    return settings.entitiesPerPage
  },

  getAboutSettings () {
    return {
      version: settings?.version || '',
      productName: settings?.productName || ''
    }
  },

  getLanguageList () {
    return settings?.languageList || []
  },

  getThemeList () {
    return settings?.themeList || []
  },

  getMobileThemeList () {
    return settings?.mobileThemeList || []
  },

  getCookieSettings () {
    return {
      authTokenCookieExpireTime: settings.authTokenCookieExpireTime,
      cookieSecure: settings.cookieSecure,
      cookiePath: settings.cookiePath,
    }
  },

  getAdminAccountData () {
    return {
      adminLogin: settings?.adminLogin || '',
      adminHasPassword: settings?.adminHasPassword || false,
      adminLanguage: settings?.adminLanguage || '',
    }
  },

  getCommonSettingData () {
    return {
      siteName: settings.siteName,
      theme: settings.theme,
      mobileTheme: settings.mobileTheme,
      language: settings.language,
      timeFormat: settings.timeFormat
    }
  },

  getDatabaseSettingsData () {
    return {
      dbName: settings.dbName,
      dbLogin: settings.dbLogin,
      dbHost: settings.dbHost,
    }
  },
  getStoreAuthTokenInDB () {
    return settings.storeAuthTokenInDB
  },

  getLoggingData () {
    return {
      enableEventLogging: settings.enableEventLogging,
      enableLogging: settings.enableLogging,
      loggingLevel: settings.loggingLevel,
      viewLastLogSize: settings.viewLastLogSize
    }
  },

  saveAdminAccountData (data) {
    settings.saveAdminAccountData(data)
  },

  saveCommonSettingData (data) {
    settings.saveCommonSettingData(data)
  },

  saveDatabaseSetting (data) {
    settings.saveDatabaseSetting(data)
  },

  saveLoggingData (data) {
    settings.saveLoggingData(data)
  },
}
