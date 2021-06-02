import { i18n } from 'boot/i18n'
import store from 'src/store'

import _ from 'lodash'

import notification from 'src/utils/notification'
import typesUtils from 'src/utils/types'
// import urlUtils from 'src/utils/url'

class AdminPanelSettings {
  constructor(appData) {
    const coreData = typesUtils.pObject(appData.Core, {})
    const coreWebclientData = typesUtils.pObject(appData.CoreWebclient, {})
    const adminPanelWebclientData = typesUtils.pObject(appData.AdminPanelWebclient, {})

    if (!_.isEmpty(coreData)) {
      // this.authTokenCookieExpireTime = typesUtils.pInt(coreData.AuthTokenCookieExpireTime, 30)
      // this.autodetectLanguage = typesUtils.pBool(coreData.AutodetectLanguage)
      // this.userSelectsDateFormat = typesUtils.pBool(coreData.UserSelectsDateFormat)
      // this.dateFormat = typesUtils.pString(coreData.DateFormat, 'DD/MM/YYYY')
      // this.dateFormatList = typesUtils.pArray(coreData.DateFormatList, ['DD/MM/YYYY'])
      // if (_.indexOf(this.dateFormatList, this.dateFormat) === -1) {
      //   this.dateFormatList.unshift(this.dateFormat)
      // }
      // this.EUserRole = typesUtils.pObject(coreData.EUserRole)
      this.isSystemConfigured = typesUtils.pBool(coreData.IsSystemConfigured)
      // this.language = typesUtils.pString(coreData.Language, 'English')
      // this.lastErrorCode = typesUtils.pInt(coreData.LastErrorCode)
      this.shortLanguage = this._getShortLanguage(coreData)
      this.siteName = typesUtils.pString(coreData.SiteName)
      // this.socialName = typesUtils.pString(coreData.SocialName)
      // this.storeAuthTokenInDB = typesUtils.pBool(coreData.StoreAuthTokenInDB)
      // this.tenantName = typesUtils.pString(coreData.TenantName || urlUtils.getRequestParam('tenant'))
      // this.timeFormat = typesUtils.pString(coreData.TimeFormat) // 0 - 24, 1 - 12
      // this.timezone = typesUtils.pString(coreData.Timezone)
      // this.userId = typesUtils.pInt(coreData.UserId)
      // this.passwordMinLength = typesUtils.pNonNegativeInt(coreData.PasswordMinLength)
      // this.passwordMustBeComplex = typesUtils.pBool(coreData.PasswordMustBeComplex)
      // this.cookiePath = typesUtils.pString(coreData.CookiePath, '/')
      // if (this.cookiePath === '') {
      //   this.cookiePath = '/'
      // }
      // this.cookieSecure = typesUtils.pBool(coreData.CookieSecure)
      // this.version = typesUtils.pString(coreData.Version)
      // this.productName = typesUtils.pString(coreData.ProductName)

      // only for admin
      this.adminHasPassword = typesUtils.pBool(coreData.AdminHasPassword)
      this.adminLanguage = typesUtils.pString(coreData.AdminLanguage)
      this.adminLogin = typesUtils.pString(coreData.AdminLogin)
      // this.commonLanguage = typesUtils.pString(coreData.CommonLanguage)
      // this.dbHost = typesUtils.pString(coreData.DBHost)
      // this.dbLogin = typesUtils.pString(coreData.DBLogin)
      // this.dbName = typesUtils.pString(coreData.DBName)
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
      // this.theme = typesUtils.pString(coreWebclientData.Theme, 'Default')
      // this.themeList = typesUtils.pArray(coreWebclientData.ThemeList, ['Default'])
      // this.hideLogout = typesUtils.pBool(coreWebclientData.HideLogout)
    }

    if (!_.isEmpty(adminPanelWebclientData)) {
      // this.entitiesOrder = typesUtils.pArray(adminPanelWebclientData.EntitiesOrder)
      // this.entitiesPerPage = typesUtils.pInt(adminPanelWebclientData.EntitiesPerPage, -1)
      this.tabsOrder = typesUtils.pArray(adminPanelWebclientData.TabsOrder)
      // this.tenants = typesUtils.pObject(adminPanelWebclientData.Tenants)
    }
  }

  showErrorsIfSystemNotConfigured () {
    if (this.isSystemConfigured === false) {
      notification.showError(i18n.tc('COREWEBCLIENT.ERROR_SYSTEM_NOT_CONFIGURED'), 0)
    }
    if (store.getters['user/isUserSuperAdmin']) {
      if (!this.adminHasPassword) {
        this.dismissPasswordError = notification.showError(i18n.tc('ADMINPANELWEBCLIENT.ERROR_ADMIN_EMPTY_PASSWORD'), 0)
      }
      if (!this.saltNotEmpty) {
        notification.showError(i18n.tc('ADMINPANELWEBCLIENT.ERROR_SALT_EMPTY'), 0)
      }
    }
  }

  saveAdminAccountData ({ login, password, language }) {
    this.adminHasPassword = !_.isEmpty(password)
    this.adminLanguage = language
    this.adminLogin = login
    if (this.adminHasPassword && _.isFunction(this.dismissPasswordError)) {
      this.dismissPasswordError()
      this.dismissPasswordError = null
    }
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
    return shortLanguage;
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
    store.commit('main/setSiteName', settings.siteName)
  },

  getTabsOrder () {
    return settings?.tabsOrder || []
  },

  getLanguageList () {
    return settings?.languageList || []
  },

  getAdminAccountData () {
    return {
      adminLogin: settings?.adminLogin || '',
      adminHasPassword: settings?.adminHasPassword || false,
      adminLanguage: settings?.adminLanguage || '',
    }
  },

  saveAdminAccountData (data) {
    settings.saveAdminAccountData(data)
  },
}