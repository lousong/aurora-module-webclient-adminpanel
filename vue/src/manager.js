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
    ]
  },
  init (appData) {
    settings.init(appData)
  },
}
