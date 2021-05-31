export default {
  async getModules () {
    return [
      await import('src/manager'),
      await import('src/../../../BrandingWebclient/vue/manager'),
      await import('src/../../../LicensingWebclient/vue/manager'),
      await import('src/../../../MailWebclient/vue/manager'),
    ]
  },
}
