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
        name: 'db-settings',
        title: 'ADMINPANELWEBCLIENT.HEADING_DB_SETTINGS',
        component () {
          return import('components/DbAdminSettingsView')
        },
      },
    ]
  },
  init (appData) {
    settings.init(appData)
  },
}
