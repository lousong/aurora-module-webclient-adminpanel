<template>
  <q-scroll-area class="full-height full-width relative-position">
    <div class="q-pa-lg">
      <div class="row q-mb-md">
        <div class="col text-h5" v-if="!createMode" v-t="'COREWEBCLIENT.HEADING_COMMON_SETTINGS'"></div>
        <div class="col text-h5" v-if="createMode" v-t="'ADMINPANELWEBCLIENT.HEADING_CREATE_TENANT'"></div>
      </div>
      <q-card flat bordered class="card-edit-settings">
        <q-card-section>
          <div class="row q-mb-md">
            <div class="col-2 q-mt-sm" v-t="'ADMINPANELWEBCLIENT.LABEL_PRODUCT_NAME'"></div>
            <div class="col-5">
              <q-input outlined dense bg-color="white" v-model="tenantName"/>
            </div>
          </div>
          <div class="row q-mb-md">
            <div class="col-2 q-mt-sm" v-t="'ADMINPANELWEBCLIENT.LABEL_DESCRIPTION'"></div>
            <div class="col-5">
              <q-input outlined dense bg-color="white" v-model="description"/>
            </div>
          </div>
          <div class="row q-mb-md">
            <div class="col-2 q-mt-sm" v-t="'ADMINPANELWEBCLIENT.LABEL_WEB_DOMAIN'"></div>
            <div class="col-5">
              <q-input outlined dense bg-color="white" v-model="webDomain"/>
            </div>
          </div>
          <div class="row">
            <div class="col-2 q-mt-sm" v-t="'COREWEBCLIENT.LABEL_SITENAME'"></div>
            <div class="col-5">
              <q-input outlined dense bg-color="white" v-model="tenantSiteName"/>
            </div>
          </div>
          <component v-bind:is="otherDataComponents" @updateParent="getTenantData" />
        </q-card-section>
      </q-card>
      <div class="q-py-md text-right">
       <q-btn unelevated no-caps dense class="q-px-sm" :ripple="false" color="negative" @click="deleteTenant"
               :label="$t('ADMINPANELWEBCLIENT.ACTION_DELETE_TENANT')" v-if="!createMode">
        </q-btn>
        <q-btn unelevated no-caps dense class="q-px-sm q-ml-sm" :ripple="false" color="primary" @click="save"
               :label="saveButtonText">
        </q-btn>
        <q-btn unelevated no-caps dense class="q-px-sm q-ml-sm" :ripple="false" color="secondary" @click="save"
               :label="$t('COREWEBCLIENT.ACTION_CANCEL')" v-if="createMode" >
        </q-btn>
      </div>
    </div>
    <q-inner-loading style="justify-content: flex-start;" :showing="loading || deleting || saving">
      <q-linear-progress query />
    </q-inner-loading>
  </q-scroll-area>
</template>

<script>
import _ from 'lodash'

import TenantModel from 'src/classes/tenant'
import typesUtils from 'src/utils/types'
import webApi from 'src/utils/web-api'
import notification from 'src/utils/notification'
import errors from 'src/utils/errors'
import cache from 'src/cache'
import modulesManager from 'src/modules-manager'

export default {
  name: 'EditTenant',
  props: {
    deletingIds: Array,
  },
  data () {
    return {
      tenant: null,
      tenantId: 0,
      tenantName: '',
      tenantSiteName: '',
      description: '',
      webDomain: '',
      saving: false,
      loading: false,
      otherDataComponents: null,
      enableBusinessTenant: false,
      enableGroupWare: false
    }
  },
  computed: {
    currentTenantId () {
      return this.$store.getters['tenants/getCurrentTenantId']
    },

    createMode () {
      return this.tenant?.id === 0
    },
    saveButtonText () {
      if (this.createMode) {
        if (this.saving) {
          return this.$t('COREWEBCLIENT.ACTION_CREATE_IN_PROGRESS')
        } else {
          return this.$t('COREWEBCLIENT.ACTION_CREATE')
        }
      } else {
        if (this.saving) {
          return this.$t('COREWEBCLIENT.ACTION_SAVE_IN_PROGRESS')
        } else {
          return this.$t('COREWEBCLIENT.ACTION_SAVE')
        }
      }
    },
    deleting () {
      return this.deletingIds.indexOf(this.tenant?.id) !== -1
    },
  },
  async mounted () {
    this.loading = false
    this.saving = false
    this.parseRoute()
    this.otherDataComponents = await modulesManager.getTenantOtherDataComponents()
  },
  watch: {
    $route() {
      this.parseRoute()
    },
  },

  methods: {
    getTenantData (val) {
      this.enableBusinessTenant = val.enableBusinessTenant
      this.enableGroupWare = val.enableGroupWare
    },
    parseRoute () {
      if (this.$route.path === '/tenants/create') {
        const tenant = new TenantModel()
        this.fillUp(tenant)
      } else {
        const tenantId = typesUtils.pPositiveInt(this.$route?.params?.id)
        if (this.tenant?.id !== tenantId) {
          this.tenant = {
            id: tenantId,
          }
          this.populate()
        }
      }
    },
    populate () {
      this.loading = true
      cache.getTenant(this.tenant.id).then(({ tenant, tenantId }) => {
        if (tenantId === this.tenant.id) {
          this.loading = false
          if (tenant) {
            this.fillUp(tenant)
          }
        }
      })
    },
    fillUp (tenant) {
      this.tenant = tenant
      this.tenantId = tenant.id
      this.tenantName = tenant.name
      this.tenantSiteName = tenant.siteName
      this.description = tenant.completeData?.Description
      this.webDomain = tenant.completeData?.WebDomain
    },
    save () {
      if (!this.saving) {
        this.saving = true
        const parameters = {
          Name: this.tenantName,
          Description: this.description,
          WebDomain: this.webDomain,
          SiteName: this.tenantSiteName,
          'CoreUserGroupsLimits::IsBusiness': this.enableBusinessTenant,
          'CoreUserGroupsLimits::EnableGroupware': this.enableGroupWare
        }
        const createMode = this.createMode
        if (!createMode) {
          parameters.TenantId = this.currentTenantId
        }
        webApi.sendRequest({
          moduleName: 'Core',
          methodName: createMode ? 'CreateTenant' : 'UpdateTenant',
          parameters,
        }).then(result => {
          if (createMode) {
            this.handleCreateResult(result, parameters)
          } else {
            this.handleUpdateResult(result, parameters)
          }
          this.saving = false
        }, response => {
          this.saving = false
          const errorConst = createMode ? 'ERROR_CREATE_ENTITY_TENANT' : 'ERROR_UPDATE_ENTITY_TENANT'
          notification.showError(errors.getTextFromResponse(response, this.$t('ADMINPANELWEBCLIENT.' + errorConst)))
        })
      }
    },
    handleCreateResult (result) {
      if (_.isSafeInteger(result)) {
        notification.showReport(this.$t('ADMINPANELWEBCLIENT.REPORT_CREATE_ENTITY_TENANT'))
        this.loading = false
        this.populate()
        this.$emit('tenant-created', result)
      } else {
        notification.showError(this.$t('ADMINPANELWEBCLIENT.ERROR_CREATE_ENTITY_TENANT'))
      }
    },
    handleUpdateResult (result, tenantsParameters) {
      if (result === true) {
        cache.getTenant(this.tenantId).then(({ tenant }) => {
          tenant.update(tenantsParameters.Name, tenantsParameters.SiteName, tenantsParameters)
          this.populate()
        })
        notification.showReport(this.$t('ADMINPANELWEBCLIENT.REPORT_UPDATE_ENTITY_TENANT'))
      } else {
        notification.showError(this.$t('ADMINPANELWEBCLIENT.ERROR_UPDATE_ENTITY_TENANT'))
      }
    },
    deleteTenant () {
      this.$emit('delete-tenant', this.tenant.id)
    },
  }
}
</script>

<style scoped>

</style>
