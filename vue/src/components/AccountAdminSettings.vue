<template>
  <q-scroll-area class="full-height full-width">
    <div class="q-pa-lg ">
      <div class="row q-mb-md">
        <div class="col text-h5" v-t="'ADMINPANELWEBCLIENT.HEADING_SECURITY_SETTINGS'"></div>
      </div>
      <q-card flat bordered class="card-edit-settings">
        <q-card-section>
          <div class="row q-mb-md">
            <div class="col-1" v-t="'ADMINPANELWEBCLIENT.LABEL_SECURITY_LOGIN'"></div>
            <div class="col-5">
              <q-input outlined dense class="bg-white" v-model="login" @keyup.enter="save" />
            </div>
          </div>
          <div class="row q-mb-md">
            <div class="col-1" v-t="'ADMINPANELWEBCLIENT.LABEL_SECURITY_PASS'"></div>
            <div class="col-5">
              <q-input outlined dense class="bg-white" ref="oldPassword" type="password" v-model="oldPassword"
                       @keyup.enter="save" />
            </div>
          </div>
          <div class="row q-mb-md">
            <div class="col-1" v-t="'ADMINPANELWEBCLIENT.LABEL_SECURITY_NEW_PASS'"></div>
            <div class="col-5">
              <q-input outlined dense class="bg-white" ref="newPassword" v-model="newPassword" type="password"
                       @keyup.enter="save" />
            </div>
          </div>
          <div class="row q-mb-md">
            <div class="col-1" v-t="'ADMINPANELWEBCLIENT.LABEL_SECURITY_CONFIRM_PASS'"></div>
            <div class="col-5">
              <q-input outlined dense class="bg-white" v-model="confirmNewPassword" type="password"
                       @keyup.enter="save" />
            </div>
          </div>
          <div class="row">
            <div class="col-1" v-t="'COREWEBCLIENT.LABEL_LANGUAGE'"></div>
            <div class="col-5">
              <q-select outlined dense class="bg-white" v-model="language"
                        emit-value map-options :options="languageOptions" option-label="name" />
            </div>
          </div>
        </q-card-section>
      </q-card>
      <div class="q-pa-md text-right">
        <q-btn unelevated no-caps dense class="q-px-sm" :ripple="false" color="primary" @click="save"
               :label="saving ? $t('COREWEBCLIENT.ACTION_SAVE_IN_PROGRESS') : $t('COREWEBCLIENT.ACTION_SAVE')">
        </q-btn>
      </div>
    </div>
    <UnsavedChangesDialog ref="unsavedChangesDialog" />
  </q-scroll-area>
</template>

<script>
import _ from 'lodash'

import errors from 'src/utils/errors'
import notification from 'src/utils/notification'
import webApi from 'src/utils/web-api'

import settings from 'src/settings'

import UnsavedChangesDialog from 'src/components/UnsavedChangesDialog'

export default {
  name: 'AdminAccount',

  components: {
    UnsavedChangesDialog,
  },

  data() {
    return {
      login: '',
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      language: '',
      languageOptions: [],
      saving: false,
    }
  },

  beforeRouteLeave (to, from, next) {
    if (this.hasChanges() && _.isFunction(this?.$refs?.unsavedChangesDialog?.openConfirmDiscardChangesDialog)) {
      this.$refs.unsavedChangesDialog.openConfirmDiscardChangesDialog(next)
    } else {
      next()
    }
  },

  mounted () {
    this.languageOptions = settings.getLanguageList()
    this.saving = false
    this.populate()
  },

  methods: {
    populate () {
      const data = settings.getAdminAccountData()
      this.login = data.adminLogin
      this.oldPassword = ''
      this.newPassword = ''
      this.confirmNewPassword = ''
      this.language = data.adminLanguage
    },

    hasChanges () {
      const data = settings.getAdminAccountData()
      return this.login !== data.adminLogin || this.oldPassword !== '' || this.newPassword !== '' ||
        this.confirmNewPassword !== '' || this.language !== data.adminLanguage
    },

    isDataValid () {
      const data = settings.getAdminAccountData()
      const oldPassword = _.trim(this.oldPassword)
      const newPassword = _.trim(this.newPassword)
      const confirmNewPassword = _.trim(this.confirmNewPassword)
      if (data.adminHasPassword && oldPassword === '' && newPassword !== '') {
        notification.showError(this.$t('ADMINPANELWEBCLIENT.ERROR_CURRENT_PASSWORD_EMPTY'))
        this.$refs.oldPassword.$el.focus()
        return false
      }
      if (oldPassword !== '' && newPassword === '') {
        notification.showError(this.$t('ADMINPANELWEBCLIENT.ERROR_NEW_PASSWORD_EMPTY'))
        this.$refs.newPassword.$el.focus()
        return false
      }
      if (oldPassword !== '' && newPassword !== confirmNewPassword) {
        notification.showError(this.$t('COREWEBCLIENT.ERROR_PASSWORDS_DO_NOT_MATCH'))
        this.$refs.newPassword.$el.focus()
        return false
      }
      return true
    },

    save () {
      if (!this.saving && this.isDataValid()) {
        this.saving = true
        const parameters = {
          AdminLogin: this.login,
          Password: this.oldPassword,
          NewPassword: this.newPassword,
          AdminLanguage: this.language
        }
        webApi.sendRequest({
          moduleName: 'Core',
          methodName: 'UpdateSettings',
          parameters,
        }).then(result => {
          this.saving = false
          if (result === true) {
            settings.saveAdminAccountData({
              login: parameters.AdminLogin,
              password: parameters.NewPassword,
              language: parameters.AdminLanguage,
            })
            this.populate()
            notification.showReport(this.$t('COREWEBCLIENT.REPORT_SETTINGS_UPDATE_SUCCESS'))
          } else {
            notification.showError(this.$t('COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED'))
          }
        }, response => {
          this.saving = false
          notification.showError(errors.getTextFromResponse(response, this.$t('COREWEBCLIENT.ERROR_SAVING_SETTINGS_FAILED')))
        })
      }
    },
  },
}
</script>

<style scoped>

</style>
