<template>
  <q-page-container style="height: 100vh">
    <q-page class="flex flex-stretch full-height">
      <q-splitter class="full-height full-width" v-model="listSplitterWidth" :limits="[10,30]">
        <template v-slot:before>
          <div class="flex column full-height">
            <q-toolbar class="col-auto">
              <q-btn flat color="grey-8" size="lg" icon="delete" :label="countLabel" :disable="checkedIds.length === 0"
                     @click="askDeleteCheckedTenants">
                <q-tooltip>
                  {{ $t('COREWEBCLIENT.ACTION_DELETE') }}
                </q-tooltip>
              </q-btn>
              <q-btn flat color="grey-8" size="lg" icon="add" @click="routeCreateTenant">
                <q-tooltip>
                  {{ $t('ADMINPANELWEBCLIENT.ACTION_CREATE_ENTITY_TENANT') }}
                </q-tooltip>
              </q-btn>
            </q-toolbar>
            <StandardList class="col-grow" :items="tenantItems" :selectedItem="selectedUserId" :loading="loadingTenants"
                          :totalCountText="totalCountText" :search="search" :page="page" :pagesCount="pagesCount"
                          ref="userList" @route="route" @check="afterCheck" />
          </div>
        </template>
        <template v-slot:after>
          <q-splitter v-if="showTabs" class="full-height full-width" v-model="tabsSplitterWidth" :limits="[10,30]">
            <template v-slot:before>
              <q-list>
                <div>
                  <q-item clickable @click="route(selectedUserId)" :class="selectedTab === '' ? 'bg-selected-item' : ''">
                    <q-item-section>
                      <q-item-label lines="1" v-t="'ADMINPANELWEBCLIENT.LABEL_COMMON_SETTINGS_TAB'"></q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator />
                </div>
                <div v-for="tab in tabs" :key="tab.tabName">
                  <q-item clickable @click="route(selectedUserId, tab.tabName)" :class="selectedTab === tab.tabName ? 'bg-selected-item' : ''">
                    <q-item-section>
                      <q-item-label lines="1">{{ $t(tab.title) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator />
                </div>
              </q-list>
            </template>
            <template v-slot:after>
              <router-view @no-user-found="handleNoUserFound" @tenant-created="handleCreateTenant"
                           @cancel-create="route" @delete-tenant="askDeleteTenant" :deletingIds="deletingIds"></router-view>
            </template>
          </q-splitter>
          <router-view v-if="!showTabs" @no-user-found="handleNoUserFound" @tenant-created="handleCreateTenant"
                       @cancel-create="route" @delete-tenant="askDeleteTenant" :deletingIds="deletingIds"></router-view>
        </template>
      </q-splitter>
    </q-page>
    <ConfirmDialog ref="confirmDialog" />
  </q-page-container>
</template>

<script>
import typesUtils from 'src/utils/types'
import modulesManager from 'src/modules-manager'
import _ from 'lodash'
import core from 'src/core'
import cache from 'src/cache'
import notification from 'src/utils/notification'
import webApi from 'src/utils/web-api'
import errors from 'src/utils/errors'
import ConfirmDialog from 'components/ConfirmDialog'
import StandardList from 'components/StandardList'
import EditTenant from 'components/EditTenant'
import Empty from 'components/Empty'

export default {
  name: 'Tenants',
  components: {
    ConfirmDialog,
    StandardList,
  },
  data() {
    return {
      tenants: [],
      selectedUserId: 0,
      loadingTenants: false,
      totalCount: 0,

      search: '',
      page: 1,
      limit: 10,

      tenantItems: [],
      checkedIds: [],

      justCreatedId: 0,

      deletingIds: [],

      tabs: [],
      selectedTab: '',

      listSplitterWidth: 20,
      tabsSplitterWidth: 20,
    }
  },

  computed: {
    pagesCount () {
      return Math.ceil(this.totalCount / this.limit)
    },

    countLabel () {
      const count = this.checkedIds.length
      return count > 0 ? count : ''
    },

    totalCountText () {
      return this.$tc('ADMINPANELWEBCLIENT.LABEL_USERS_COUNT', this.totalCount, { COUNT: this.totalCount })
    },

    showTabs () {
      return this.tabs.length > 0 && this.selectedUserId > 0
    },
  },

  watch: {
    $route (to, from) {
      if (this.$route.path === '/tenants/create') {
        this.selectedUserId = 0
      } else {
        const search = typesUtils.pString(this.$route?.params?.search)
        const page = typesUtils.pPositiveInt(this.$route?.params?.page)
        if (this.search !== search || this.page !== page || this.justCreatedId !== 0) {
          this.search = search
          this.page = page
          this.populate()
        }

        const userId = typesUtils.pNonNegativeInt(this.$route?.params?.id)
        if (this.selectedUserId !== userId) {
          this.selectedUserId = userId
        }

        const pathParts = this.$route.path.split('/')
        const lastPart = pathParts.length > 0 ? pathParts[pathParts.length - 1] : ''
        const tab = this.tabs.find(tab => { return tab.tabName === lastPart })
        this.selectedTab = tab ? tab.tabName : ''
      }
    },

    tenants () {
      this.tenantItems = this.tenants.map(tenant => {
        return {
          id: tenant.id,
          title: tenant.name,
          checked: false,
        }
      })
    },
  },
  mounted () {
    this.$router.addRoute('tenants', { path: 'id/:id', component: EditTenant })
    this.$router.addRoute('tenants', { path: 'create', component: EditTenant })
    this.$router.addRoute('tenants', { path: 'search/:search', component: Empty })
    this.$router.addRoute('tenants', { path: 'search/:search/id/:id', component: EditTenant })
    this.$router.addRoute('tenants', { path: 'page/:page', component: Empty })
    this.$router.addRoute('tenants', { path: 'page/:page/id/:id', component: EditTenant })
    this.$router.addRoute('tenants', { path: 'search/:search/page/:page', component: Empty })
    this.$router.addRoute('tenants', { path: 'search/:search/page/:page/id/:id', component: EditTenant })
    this.populateTabs()
    this.populate()
  },
  methods: {
    populateTabs () {
      this.tabs = typesUtils.pArray(modulesManager.getAdminUserTabs())
      _.each(this.tabs, (tab) => {
        if (typesUtils.isNonEmptyArray(tab.paths)) {
          tab.paths.forEach(path => {
            this.$router.addRoute('tenants', { path, component: tab.component })
          })
        } else {
          this.$router.addRoute('tenants', { path: tab.tabName, component: tab.component })
        }
      })
    },

    populate () {
      this.loadingTenants = true
      const currentTenantId = core.getCurrentTenantId()
      cache.getTenants(currentTenantId, 'Tenant', this.page, this.limit, this.search).then(({ tenants, totalCount, search, page, limit }) => {
        if (page === this.page && search === this.search) {
          this.tenants = tenants
          this.totalCount = totalCount
          this.loadingTenants = false
          if (this.justCreatedId && tenants.find(tenant => {
            return tenant.id === this.justCreatedId
          })) {
            this.route(this.justCreatedId)
            this.justCreatedId = 0
          }
        }
      })
    },

    route (userId = 0, tabName = '') {
      const enteredSearch = this.$refs?.userList?.enteredSearch || ''
      const searchRoute = enteredSearch !== '' ? `/search/${enteredSearch}` : ''

      let selectedPage = this.$refs?.userList?.selectedPage || 1
      if (this.search !== enteredSearch) {
        selectedPage = 1
      }
      const pageRoute = selectedPage > 1 ? `/page/${selectedPage}` : ''

      const idRoute = userId > 0 ? `/id/${userId}` : ''
      const tabRoute = tabName !== '' ? `/${tabName}` : ''
      const path = '/tenants' + searchRoute + pageRoute + idRoute + tabRoute
      if (path !== this.$route.path) {
        this.$router.push(path)
      }
    },

    routeCreateTenant () {
      this.$router.push('/tenants/create')
    },

    handleCreateTenant (id) {
      this.justCreatedId = id
      this.route()
    },

    afterCheck (ids) {
      this.checkedIds = ids
    },

    handleNoUserFound () {
      notification.showError(this.$t('ADMINPANELWEBCLIENT.ERROR_USER_NOT_FOUND'))
      this.route()
      this.populate()
    },

    askDeleteTenant (id) {
      this.askDeleteTenants([id])
    },

    askDeleteCheckedTenants () {
      this.askDeleteTenants(this.checkedIds)
    },

    askDeleteTenants (ids) {
      if (_.isFunction(this?.$refs?.confirmDialog?.openDialog)) {
        const tenant = ids.length === 1
          ? this.tenants.find(tenant => {
            return tenant.id === ids[0]
          })
          : null
        const title = tenant ? tenant.name : ''
        this.$refs.confirmDialog.openDialog({
          title,
          message: this.$tc('ADMINPANELWEBCLIENT.CONFIRM_DELETE_TENANT_PLURAL', ids.length),
          okHandler: this.deleteTenants.bind(this, ids)
        })
      }
    },

    deleteTenants (ids) {
      const currentTenantId = core.getCurrentTenantId()
      this.deletingIds = ids
      this.loadingTenants = true
      webApi.sendRequest({
        moduleName: 'Core',
        methodName: 'DeleteTenants',
        parameters: {
          IdList: ids,
          DeletionConfirmedByAdmin: true,
          TenantId: currentTenantId,
          Type: 'Tenant',
        },
      }).then(result => {
        this.deletingIds = []
        this.loadingTenants = false
        if (result === true) {
          notification.showReport(this.$tc('ADMINPANELWEBCLIENT.REPORT_DELETE_ENTITIES_USER_PLURAL', ids.length))
          const isSelectedUserRemoved = ids.indexOf(this.selectedUserId) !== -1
          const selectedPage = this.$refs?.userList?.selectedPage || 1
          const shouldChangePage = this.tenants.length === ids.length && selectedPage > 1
          if (shouldChangePage && _.isFunction(this.$refs?.userList?.decreasePage)) {
            this.$refs.userList.decreasePage()
          } else if (isSelectedUserRemoved) {
            this.route()
            this.populate()
          } else {
            this.populate()
          }
        } else {
          notification.showError(this.$tc('ADMINPANELWEBCLIENT.ERROR_DELETE_ENTITIES_USER_PLURAL', ids.length))
        }
      }, error => {
        this.deletingIds = []
        this.loadingTenants = false
        notification.showError(errors.getTextFromResponse(error, this.$tc('ADMINPANELWEBCLIENT.ERROR_DELETE_ENTITIES_USER_PLURAL', ids.length)))
      })
    },
  },
}
</script>
