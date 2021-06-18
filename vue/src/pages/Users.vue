<template>
  <q-page-container style="height: 100vh">
    <q-page class="flex flex-stretch full-height">
      <q-splitter class="full-height full-width" v-model="splitterWidth" :limits="[10,30]">
        <template v-slot:before>
          <q-toolbar>
            <q-btn flat color="grey-8" size="lg" icon="delete" :label="countLabel" :disable="checkedIds.length === 0"
                   @click="askDeleteCheckedUsers">
              <q-tooltip>
                {{ $t('COREWEBCLIENT.ACTION_DELETE') }}
              </q-tooltip>
            </q-btn>
            <q-btn flat color="grey-8" size="lg" icon="add" @click="routeCreateUser">
              <q-tooltip>
                {{ $t('ADMINPANELWEBCLIENT.ACTION_CREATE_ENTITY_USER') }}
              </q-tooltip>
            </q-btn>
          </q-toolbar>
          <q-list class="bg-grey-3">
              <q-item>
                <q-item-section side>
                  <q-checkbox dense v-model="hasCheckedItems" />
                </q-item-section>
                <q-item-section>
                  <q-input rounded outlined dense v-model="enteredSearch" @keyup.enter="route">
                    <template v-slot:append>
                      <q-btn dense flat :ripple="false" icon="search" @click="route" />
                    </template>
                  </q-input>
                </q-item-section>
              </q-item>
              <q-separator />
          </q-list>
          <StandardList :items="userItems" :selectedItem="selectedUserId" :hasCheckedItems="hasCheckedItems"
                        :loading="loadingUsers" @select="route" @check="afterCheck" />
          <div v-if="pagesCount > 1">
            <q-pagination flat active-color="primary" color="grey-6" v-model="selectedPage" :max="pagesCount" />
          </div>
        </template>
        <template v-slot:after>
          <router-view @no-user-found="handleNoUserFound" @user-created="handleCreateUser"
                       @cancel-create="route" @delete-user="askDeleteUser" :deletingIds="deletingIds"></router-view>
        </template>
      </q-splitter>
    </q-page>
    <ConfirmDialog ref="confirmDialog" />
  </q-page-container>
</template>

<script>
import _ from 'lodash'

import errors from 'src/utils/errors'
import notification from 'src/utils/notification'
import typesUtils from 'src/utils/types'
import webApi from 'src/utils/web-api'

import core from 'src/core'
import cache from 'src/cache'

import ConfirmDialog from 'src/components/ConfirmDialog'
import EditUser from 'src/components/EditUser'
import Empty from 'src/components/Empty'
import StandardList from 'src/components/StandardList'

export default {
  name: 'system',

  components: {
    ConfirmDialog,
    StandardList,
  },

  data() {
    return {
      page: 1,
      limit: 10,
      search: '',
      users: [],
      totalCount: 0,
      loadingUsers: false,
      selectedUserId: 0,

      userItems: [],
      enteredSearch: '',
      selectedPage: 1,
      checkedIds: [],
      hasCheckedItems: false,

      justCreatedId: 0,

      deletingIds: [],

      splitterWidth: 20,
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
  },

  watch: {
    $route (to, from) {
      if (this.$route.path === '/users/create') {
        this.selectedUserId = 0
      } else {
        const search = typesUtils.pString(this.$route?.params?.search)
        const page = typesUtils.pPositiveInt(this.$route?.params?.page)
        if (this.search !== search || this.page !== page || this.justCreatedId !== 0) {
          this.search = search
          this.enteredSearch = search
          this.page = page
          this.selectedPage = page
          this.populate()
        }

        const userId = typesUtils.pNonNegativeInt(this.$route?.params?.id)
        if (this.selectedUserId !== userId) {
          this.selectedUserId = userId
        }
      }
    },

    users () {
      this.userItems = this.users.map(user => {
        return {
          id: user.id,
          title: user.publicId,
          checked: false,
        }
      })
    },

    selectedPage () {
      if (this.selectedPage !== this.page) {
        this.route()
      }
    },
  },

  mounted () {
    this.$router.addRoute('users', { path: 'id/:id', component: EditUser })
    this.$router.addRoute('users', { path: 'create', component: EditUser })
    this.$router.addRoute('users', { path: 'search/:search', component: Empty })
    this.$router.addRoute('users', { path: 'search/:search/id/:id', component: EditUser })
    this.$router.addRoute('users', { path: 'page/:page', component: Empty })
    this.$router.addRoute('users', { path: 'page/:page/id/:id', component: EditUser })
    this.$router.addRoute('users', { path: 'search/:search/page/:page', component: Empty })
    this.$router.addRoute('users', { path: 'search/:search/page/:page/id/:id', component: EditUser })
    this.populate()
  },

  methods: {
    populate () {
      this.loadingUsers = true
      const currentTenantId = core.getCurrentTenantId()
      cache.getUsers(currentTenantId, this.search, this.page, this.limit).then(({ users, totalCount, tenantId, page, search }) => {
        if (page === this.page && search === this.search) {
          this.users = users
          this.totalCount = totalCount
          this.loadingUsers = false
          if (this.justCreatedId && users.find(user => {
            return user.id === this.justCreatedId
          })) {
            this.route(this.justCreatedId)
            this.justCreatedId = 0
          }
        }
      })
    },

    route (userId = 0) {
      const searchRoute = this.enteredSearch !== '' ? ('/search/' + this.enteredSearch) : ''
      const selectedPage = (this.search !== this.enteredSearch) ? 1 : this.selectedPage
      const pageRoute = selectedPage > 1 ? ('/page/' + selectedPage) : ''
      const idRoute = userId > 0 ? ('/id/' + userId) : ''
      const path = '/users' + searchRoute + pageRoute + idRoute
      if (path !== this.$route.path) {
        this.$router.push(path)
      }
    },

    routeCreateUser () {
      this.$router.push('/users/create')
    },

    handleCreateUser (id) {
      this.justCreatedId = id
      this.route()
    },

    afterCheck (ids) {
      this.checkedIds = ids
      this.hasCheckedItems = ids.length > 0
    },

    handleNoUserFound () {
      notification.showError(this.$t('ADMINPANELWEBCLIENT.ERROR_USER_NOT_FOUND'))
      this.route()
      this.populate()
    },

    askDeleteUser (id) {
      this.askDeleteUsers([id])
    },

    askDeleteCheckedUsers () {
      this.askDeleteUsers(this.checkedIds)
    },

    askDeleteUsers (ids) {
      if (_.isFunction(this?.$refs?.confirmDialog?.openDialog)) {
        const user = ids.length === 1
          ? this.users.find(user => {
            return user.id === ids[0]
          })
          : null
        const title = user ? user.publicId : ''
        this.$refs.confirmDialog.openDialog({
          title,
          message: this.$tc('ADMINPANELWEBCLIENT.CONFIRM_DELETE_USER_PLURAL', ids.length),
          okHandler: this.deleteUsers.bind(this, ids)
        })
      }
    },

    deleteUsers (ids) {
      this.deletingIds = ids
      this.loadingUsers = true
      webApi.sendRequest({
        moduleName: 'Core',
        methodName: 'DeleteUsers',
        parameters: {
          IdList: ids,
          DeletionConfirmedByAdmin: true
        },
      }).then(result => {
        this.deletingIds = []
        this.loadingUsers = false
        if (result === true) {
          notification.showReport(this.$tc('ADMINPANELWEBCLIENT.REPORT_DELETE_ENTITIES_USER_PLURAL', ids.length))
          const isSelectedUserRemoved = ids.indexOf(this.selectedUserId) !== -1
          const shouldChangePage = this.users.length === ids.length && this.selectedPage > 1
          if (shouldChangePage) {
            this.selectedPage -= 1
            this.route()
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
        this.loadingUsers = false
        notification.showError(errors.getTextFromResponse(error, this.$tc('ADMINPANELWEBCLIENT.ERROR_DELETE_ENTITIES_USER_PLURAL', ids.length)))
      })
    },
  },
}
</script>

<style lang="scss">
</style>
