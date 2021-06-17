import settings from 'src/settings'

export default {
  name: 'AdminPanelWebclient',
  getAdminSystemTabs () {
    return [
      {
        name: 'admin-security',
        title: 'ADMINPANELWEBCLIENT.LABEL_SECURITY_SETTINGS_TAB',
        component () {
          return import('components/AccountAdminSettings')
        },
      },
      {
        name: 'admin-db',
        title: 'ADMINPANELWEBCLIENT.HEADING_DB_SETTINGS',
        component () {
          return import('components/DbAdminSettingsView')
        },
      },
      {
        name: 'about',
        title: 'ADMINPANELWEBCLIENT.LABEL_ABOUT_SETTINGS_TAB',
        component () {
          return import('components/AboutAdminSettings')
        },
      }
    ]
  },
  init (appData) {
    settings.init(appData)
  },
}
