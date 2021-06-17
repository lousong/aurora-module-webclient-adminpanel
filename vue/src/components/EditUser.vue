<template>
  <q-scroll-area class="full-height full-width relative-position">
    <div class="q-pa-lg ">
      <div class="row q-mb-md">
        <div class="col text-h5" v-t="'COREWEBCLIENT.HEADING_COMMON_SETTINGS'"></div>
      </div>
      <q-card flat bordered class="card-edit-settings">
        <q-card-section>
          <div class="row q-mb-md">
            <div class="col-1" v-t="'COREWEBCLIENT.LABEL_EMAIL'"></div>
            <div class="col-5">
              <q-input outlined dense class="bg-white" v-model="publicId" ref="publicId" :disable="disablePublicId" @keyup.enter="save" />
            </div>
          </div>
          <div class="row q-mb-md">
            <div class="col-1"></div>
            <div class="col-5">
              <q-checkbox dense v-model="isTenantAdmin" :label="$t('ADMINPANELWEBCLIENT.LABEL_USER_IS_TENANT_ADMIN')" />
            </div>
          </div>
          <div class="row">
            <div class="col-1"></div>
            <div class="col-5">
              <q-checkbox dense v-model="writeSeparateLog" :label="$t('ADMINPANELWEBCLIENT.LABEL_LOGGING_SEPARATE_LOG_FOR_USER')" />
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
    <q-inner-loading :showing="loading">
      <q-spinner size="50px" color="primary" />
    </q-inner-loading>
  </q-scroll-area>
</template>

<script>
import _ from 'lodash'

import errors from 'src/utils/errors'
import notification from 'src/utils/notification'
import typesUtils from 'src/utils/types'
import webApi from 'src/utils/web-api'

import cache from 'src/cache'
import core from 'src/core'

import UnsavedChangesDialog from 'src/components/UnsavedChangesDialog'

import enums from 'src/enums'
const UserRoles = enums.getUserRoles()

export default {
  name: 'EditUser',

  components: {
    UnsavedChangesDialog,
  },

  data() {
    return {
      user: null,
      publicId: '',
      isTenantAdmin: false,
      writeSeparateLog: false,
      loading: false,
      saving: false,
    }
  },

  computed: {
    disablePublicId () {
      return !!this.user?.id
    },
  },

  watch: {
    $route(to, from) {
      this.parseRoute()
    },
  },

  beforeRouteLeave (to, from, next) {
    if (this.hasChanges() && _.isFunction(this?.$refs?.unsavedChangesDialog?.openConfirmDiscardChangesDialog)) {
      this.$refs.unsavedChangesDialog.openConfirmDiscardChangesDialog(next)
    } else {
      next()
    }
  },

  mounted () {
    this.loading = false
    this.saving = false
    this.parseRoute()
  },

  methods: {
    parseRoute () {
      if (this.$route.path === '/users/create') {
        // this.createMode = true
        // this.showServerFields = false
        // this.populateUser()
      } else {
        // this.createMode = false

        const userId = typesUtils.pPositiveInt(this.$route?.params?.id)
        if (this.user?.id !== userId) {
          this.user = {
            id: userId,
          }
          this.populate()
        }
      }
    },

    clear () {
      this.publicId = ''
      this.isTenantAdmin = false
      this.writeSeparateLog = false
    },

    populate () {
      this.clear()
      this.loading = true
      const currentTenantId = core.getCurrentTenantId()
      cache.getUser(currentTenantId, this.user.id).then(({ user, userId }) => {
        if (userId === this.user.id) {
          this.loading = false
          if (user) {
            this.user = user
            this.publicId = user.publicId
            this.isTenantAdmin = user.role === UserRoles.TenantAdmin
            this.writeSeparateLog = user.writeSeparateLog
          } else {
            this.$emit('no-user-found')
          }
        }
      })
    },

    hasChanges () {
      return this.publicId !== this.user?.publicId ||
        this.isTenantAdmin !== (this.user?.role === UserRoles.TenantAdmin) ||
        this.writeSeparateLog !== this.user?.writeSeparateLog
    },

    isDataValid () {
      const publicId = _.trim(this.publicId)
      if (publicId === '') {
        notification.showError(this.$t('ADMINPANELWEBCLIENT.ERROR_USER_NAME_EMPTY'))
        this.$refs.publicId.$el.focus()
        return false
      }
      return true
    },

    save () {
      if (!this.saving && this.isDataValid()) {
        this.saving = true
        const parameters = {
          UserId: this.user.id,
          TenantId: this.user.tenantId,
          PublicId: this.user.publicId,
          Role: this.isTenantAdmin ? UserRoles.TenantAdmin : UserRoles.NormalUser,
          WriteSeparateLog: this.writeSeparateLog,
          Forced: true,
        }
        webApi.sendRequest({
          moduleName: 'Core',
          methodName: 'UpdateUser',
          parameters,
        }).then(result => {
          this.saving = false
          if (result === true) {
            cache.getUser(parameters.TenantId, parameters.UserId).then(({ user }) => {
              user.update(parameters.Role, parameters.WriteSeparateLog)
              this.populate()
            })
            notification.showReport(this.$t('ADMINPANELWEBCLIENT.REPORT_UPDATE_ENTITY_USER'))
          } else {
            notification.showError(this.$t('ADMINPANELWEBCLIENT.ERROR_UPDATE_ENTITY_USER'))
          }
        }, response => {
          this.saving = false
          notification.showError(errors.getTextFromResponse(response, this.$t('ADMINPANELWEBCLIENT.ERROR_UPDATE_ENTITY_USER')))
        })
      }
    },
  },
}
</script>

<style scoped>

</style>
