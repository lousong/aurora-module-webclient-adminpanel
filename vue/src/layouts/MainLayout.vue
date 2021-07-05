<template>
  <q-layout view="hHh LpR lfr">
    <q-header v-show="showHeader">
      <q-tabs class="q-py-sm" no-caps align="left" indicator-color="transparent">
        <q-route-tab to="/system" :ripple="false" class="q-px-none">
          <div class="q-px-md tab-label" v-t="'ADMINPANELWEBCLIENT.HEADING_SYSTEM_SETTINGS_TABNAME'"></div>
        </q-route-tab>
        <q-route-tab to="/tenants" :ripple="false" class="q-px-none" v-if="enableMultiTenant">
          <div class="q-px-md tab-label">
            <span v-t="'ADMINPANELWEBCLIENT.HEADING_TENANTS_SETTINGS_TABNAME'"></span>
            <span v-if="tenants.length > 1">:</span>
          </div>
        </q-route-tab>
        <q-btn-dropdown no-icon-animation cover auto-close stretch flat dense :ripple="false" @click.stop
                        v-if="enableMultiTenant && tenants.length > 1" :label="selectedTenantName"
                        class="q-px-none text-capitalize text-weight-regular no-hover"
                        style="margin-bottom: -1px; margin-left: -6px;">
          <q-list class="non-selectable" v-for="tenant in tenants" :key="tenant.id">
            <q-item clickable @click="changeTenant(tenant.id)">
              <q-item-section>{{tenant.name}}</q-item-section>
              <q-item-section avatar v-show="tenant.id === 1">
                <q-icon name="arrow_drop_up" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-route-tab v-for="page in pages" :key="page.pageName" :to="'/' + page.pageName" :ripple="false" class="q-px-none">
          <div class="q-px-md tab-label">{{ $t(page.pageTitle)}}</div>
        </q-route-tab>
        <q-space />
        <q-tab :ripple="false" class="q-px-none q-tab--logout" @click="proceedLogout">
          <div class="q-px-md tab-label" v-t="'COREWEBCLIENT.ACTION_LOGOUT'"></div>
        </q-tab>
      </q-tabs>
    </q-header>
    <q-page-container style="height: 100vh">
      <q-page :class="{ 'full-height': !isLoginPage, 'login-page': isLoginPage, 'flex-stretch': !isLoginPage, 'flex-center': isLoginPage }" class="flex">
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import _ from 'lodash'

import typesUtils from 'src/utils/types'

import core from 'src/core'
import modulesManager from 'src/modules-manager'
import settings from 'src/settings'

export default {
  name: 'admin',

  components: {
  },

  data() {
    return {
      enableMultiTenant: settings.getEnableMultiTenant(),

      pages: [],

      selectedTenantId: null,
    }
  },

  computed: {
    currentTenantId () {
      return this.$store.getters['tenants/getCurrentTenantId']
    },
    isLoginPage () {
      return this.$route.name === 'login'
    },
    showHeader () {
      return this.$store.getters['user/isUserSuperAdmin']
    },

    tenants () {
      const tenants = typesUtils.pArray(this.$store.getters['tenants/getTenants'])
      return tenants.map(tenant => {
        return {
          id: tenant.id,
          name: tenant.name,
        }
      })
    },

    selectedTenantName () {
      const currentTenant = this.tenants.find(tenant => tenant.id === this.selectedTenantId)
      return currentTenant ? currentTenant.name : ''
    },
  },

  watch: {
    currentTenantId () {
      this.selectedTenantId = this.currentTenantId
    },
  },

  mounted () {
    if (this.enableMultiTenant) {
      this.$router.addRoute('main', { path: '/tenants', name: 'tenants', component: () => import('pages/Tenants.vue') })
      this.selectedTenantId = this.currentTenantId
      this.$store.dispatch('tenants/requestTenants')
    }

    let allPages = [{
      pageName: 'users',
      pageTitle: 'ADMINPANELWEBCLIENT.HEADING_USERS_SETTINGS_TABNAME',
    }]

    const otherPages = modulesManager.getPages()
    if (typesUtils.isNonEmptyArray(otherPages)) {
      _.each(otherPages, (page) => {
        this.$router.addRoute('main', { path: page.pageName, name: page.pageName, component: page.component })
        allPages.push({
          pageName: page.pageName,
          pageTitle: page.pageTitle,
        })
      })
    }

    const pagesOrder = settings.getEntitiesOrder()
    allPages = _.sortBy(allPages, (page) => {
      const index = _.indexOf(pagesOrder, page.pageName)
      return index !== -1 ? index : pagesOrder.length
    })

    this.pages = allPages
  },

  methods: {
    changeTenant (id) {
      this.$store.commit('tenants/setCurrentTenantId', id)
    },

    proceedLogout () {
      core.logout()
    },
  },
}
</script>
