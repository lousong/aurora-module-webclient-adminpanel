<template>
  <q-scroll-area class="full-height full-width">
    <div class="q-pa-lg ">
      <div class="row q-mb-md">
        <div class="col text-h5" v-t="'ADMINPANELWEBCLIENT.HEADING_DB_SETTINGS'"></div>
      </div>
      <q-card flat bordered class="card-edit-settings">
        <q-card-section>
          <div class="row q-mb-md">
            <div class="col-1 q-my-sm" v-t="'ADMINPANELWEBCLIENT.LABEL_DB_LOGIN'"></div>
            <div class="col-5 q-ml-xl">
              <q-input outlined dense class="bg-white" v-model="dbLogin" @keyup.enter="save" />
            </div>
          </div>
          <div class="row q-mb-md">
            <div class="col-1 q-my-sm" v-t="'ADMINPANELWEBCLIENT.LABEL_DB_PASSWORD'"></div>
            <div class="col-5  q-ml-xl">
              <q-input outlined dense class="bg-white" ref="oldPassword" type="password" v-model="dbPassword"
                       @keyup.enter="save" />
            </div>
          </div>
          <div class="row q-mb-md">
            <div class="col-1 q-my-sm" v-t="'ADMINPANELWEBCLIENT.LABEL_DN_NAME'"></div>
            <div class="col-5  q-ml-xl">
              <q-input outlined dense class="bg-white" ref="newPassword" v-model="dbName"
                       @keyup.enter="save" />
            </div>
          </div>
          <div class="row q-mb-md">
            <div class="col-1 q-my-sm" v-t="'ADMINPANELWEBCLIENT.LABEL_DB_HOST'"></div>
            <div class="col-5  q-ml-xl">
              <q-input outlined dense class="bg-white" ref="newPassword" v-model="dbHost"
                       @keyup.enter="save" />
            </div>
          </div>
          <div class="row q-mb-xl">
            <div class="col-1 q-my-sm"></div>
            <div class="col-5 q-ml-xl">
              <q-btn unelevated no-caps dense class="q-px-sm" :ripple="false" color="primary"
                     :label="$t('ADMINPANELWEBCLIENT.BUTTON_DB_TEST_CONNECTION')" @click="testDbConnection">
              </q-btn>
            </div>
          </div>
          <div class="row q-mb-md">
              <div class="col-1 q-my-sm"></div>
              <div class="col-10 q-ml-xl">
                <q-item-label caption v-t="'ADMINPANELWEBCLIENT.HINT_DB_CREATE_TABLES'" />
              </div>
          </div>
          <div class="row q-mb-md">
            <div class="col-1 q-my-sm"></div>
            <div class="col-5 q-ml-xl">
              <q-btn v-if="!creatingTables" unelevated no-caps dense class="q-px-sm" :ripple="false" color="primary"
                     :label="$t('ADMINPANELWEBCLIENT.BUTTON_DB_CREATE_TABLES')" @click="createTables">
              </q-btn>
              <q-btn v-else unelevated no-caps dense class="q-px-sm" :ripple="false" color="primary"
                     :label="$t('ADMINPANELWEBCLIENT.BUTTON_DB_CREATING_TABLES')">
              </q-btn>
            </div>
          </div>
          <div class="row q-mb-md">
            <div class="col-1 q-my-sm"></div>
            <div class="col-10 q-ml-xl">
              <q-item-label caption v-t="'ADMINPANELWEBCLIENT.HINT_UPDATE_CONFIG'"/>
            </div>
          </div>
          <div class="row q-mb-md">
            <div class="col-1 q-my-sm"></div>
            <div class="col-5 q-ml-xl">
              <q-btn unelevated no-caps dense class="q-px-sm" :ripple="false" color="primary"
                     :label=" $t('ADMINPANELWEBCLIENT.BUTTON_UPDATE_CONFIG') " @click="updateConfig">
              </q-btn>
            </div>
          </div>
        </q-card-section>
      </q-card>
      <div class="q-mt-md text-right">
        <q-btn unelevated no-caps dense class="q-px-sm" :ripple="false" color="primary"
               :label="saving ? $t('COREWEBCLIENT.ACTION_SAVE_IN_PROGRESS') : $t('COREWEBCLIENT.ACTION_SAVE')" @click="save"/>
      </div>
    </div>
    <q-dialog v-model="showDialog">
      <q-card>
        <q-card-section >
          {{$t('ADMINPANELWEBCLIENT.INFO_AUTHTOKEN_DB_STORED')}}
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat  :label="$t('COREWEBCLIENT.ACTION_OK')" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <UnsavedChangesDialog ref="unsavedChangesDialog" />
  </q-scroll-area>
</template>

<script>
import webApi from 'src/utils/web-api'
import settings from '../../../../AdminPanelWebclient/vue/src/settings'
import notification from 'src/utils/notification'
import errors from 'src/utils/errors'
import UnsavedChangesDialog from 'components/UnsavedChangesDialog'
import _ from 'lodash'

const FAKE_PASS = '     '

export default {
  name: 'DbAdminSettingsView',
  data() {
    return {
      fakePass: '     ',
      dbPassword: FAKE_PASS,
      savedPass: FAKE_PASS,
      dbLogin: '',
      dbName: '',
      dbHost: '',
      saving: false,
      showDialog: false,
      creatingTables: false
    }
  },
  components: {
    UnsavedChangesDialog,
  },
  beforeRouteLeave (to, from, next) {
    if (this.hasChanges() && _.isFunction(this?.$refs?.unsavedChangesDialog?.openConfirmDiscardChangesDialog)) {
      this.$refs.unsavedChangesDialog.openConfirmDiscardChangesDialog(next)
    } else {
      next()
    }
  },
  mounted() {
    this.populate()
  },
  computed: {
    storeAuthTokenInDB() {
      return settings.getStoreAuthTokenInDB()
    }
  },
  methods: {
    hasChanges () {
      const data = settings.getDatabaseSettingsData()
      return this.dbLogin !== data.dbLogin ||
      this.dbName !== data.dbName ||
      this.dbHost !== data.dbHost ||
      this.dbPassword !== this.savedPass
    },
    populate () {
      const data = settings.getDatabaseSettingsData()
      this.dbLogin = data.dbLogin
      this.dbName = data.dbName
      this.dbHost = data.dbHost
      this.dbPassword = FAKE_PASS
    },
    save() {
      if (!this.saving) {
        this.saving = true
        const parameters = {
          DbLogin: this.dbLogin,
          DbName: this.dbName,
          DbHost: this.dbHost,
        }
        if (FAKE_PASS !== this.dbPassword) {
          parameters.DbPassword = this.dbPassword
        }
        webApi.sendRequest({
          moduleName: 'Core',
          methodName: 'UpdateSettings',
          parameters,
        }).then(result => {
          this.saving = false
          if (result === true) {
            settings.saveDatabaseSetting({
              dbName: this.dbName,
              dbLogin: this.dbLogin,
              dbHost: this.dbHost
            })
            this.savedPass = this.dbPassword
            if (this.storeAuthTokenInDB) {
              this.showDialog = true
            }
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
    testDbConnection() {
      const parameters = {
        DbLogin: this.dbLogin,
        DbName: this.dbName,
        DbHost: this.dbHost,
      }
      if (FAKE_PASS !== this.dbPassword) {
        parameters.DbPassword = this.dbPassword
      }
      webApi.sendRequest({
        moduleName: 'Core',
        methodName: 'TestDbConnection',
        parameters,
      }).then(result => {
        if (result === true) {
          notification.showReport(this.$t('ADMINPANELWEBCLIENT.REPORT_DB_CONNECT_SUCCESSFUL'))
        } else {
          notification.showError(this.$t('ADMINPANELWEBCLIENT.ERROR_DB_CONNECT_FAILED'))
        }
      }, response => {
        notification.showError(errors.getTextFromResponse(response, this.$t('ADMINPANELWEBCLIENT.ERROR_DB_CONNECT_FAILED')))
      })
    },
    createTables() {
      this.creatingTables = true
      webApi.sendRequest({
        moduleName: 'Core',
        methodName: 'CreateTables',
      }).then(result => {
        this.creatingTables = false
        if (result === true) {
          notification.showReport(this.$t('ADMINPANELWEBCLIENT.REPORT_CREATE_TABLES_SUCCESSFUL'))
        } else {
          notification.showError(this.$t('ADMINPANELWEBCLIENT.ERROR_CREATE_TABLES_FAILED'))
        }
      }, response => {
        this.creatingTables = false
        notification.showError(errors.getTextFromResponse(response, this.$t('ADMINPANELWEBCLIENT.ERROR_CREATE_TABLES_FAILED')))
      })
    },
    updateConfig() {
      webApi.sendRequest({
        moduleName: 'Core',
        methodName: 'UpdateConfig',
      }).then(result => {
        if (result === true) {
          notification.showReport(this.$t('ADMINPANELWEBCLIENT.REPORT_UPDATE_CONFIG_SUCCESSFUL'))
        } else {
          notification.showError(this.$t('ADMINPANELWEBCLIENT.ERROR_UPDATE_CONFIG_FAILED'))
        }
      }, response => {
        notification.showError(errors.getTextFromResponse(response, this.$t('ADMINPANELWEBCLIENT.ERROR_UPDATE_CONFIG_FAILED')))
      })
    }
  }
}
</script>

<style scoped>

</style>
