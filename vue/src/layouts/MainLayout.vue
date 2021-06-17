<template>
  <q-layout view="hHh LpR lfr">
    <q-header v-show="showHeader">
      <q-tabs no-caps align="left" indicator-color="transparent">
        <q-route-tab to="/system" :ripple="false" class="q-px-none">
          <div class="q-px-sm tab-label" v-t="'ADMINPANELWEBCLIENT.HEADING_SYSTEM_SETTINGS_TABNAME'"></div>
        </q-route-tab>
<!--        <q-tab :ripple="false" class="q-px-none">-->
<!--          <router-link to="/tenants" class="q-px-sm tab-label" v-t="'ADMINPANELWEBCLIENT.HEADING_TENANTS_SETTINGS_TABNAME'">-->
<!--          </router-link>-->
<!--          <q-btn-dropdown no-icon-animation cover auto-close stretch flat :ripple="false"-->
<!--                          :label="selectedTenantName" class="text-capitalize text-weight-regular">-->
<!--            <q-list class="non-selectable" v-for="oTenant in aTenants" :key="oTenant.id">-->
<!--              <q-item clickable>-->
<!--                <q-item-section>{{oTenant.name}}</q-item-section>-->
<!--                <q-item-section avatar v-show="oTenant.id === 1">-->
<!--                  <q-icon name="arrow_drop_up" />-->
<!--                </q-item-section>-->
<!--              </q-item>-->
<!--            </q-list>-->
<!--          </q-btn-dropdown>-->
<!--        </q-tab>-->
        <q-route-tab to="/users" :ripple="false" class="q-px-none">
          <div class="q-px-sm tab-label" v-t="'ADMINPANELWEBCLIENT.HEADING_USERS_SETTINGS_TABNAME'"></div>
        </q-route-tab>
        <q-space />
        <q-tab :ripple="false" class="q-px-none" @click="proceedLogout">
          <div class="q-px-sm tab-label" v-t="'COREWEBCLIENT.ACTION_LOGOUT'"></div>
        </q-tab>
      </q-tabs>
    </q-header>
    <router-view />
  </q-layout>
</template>

<script>
import core from 'src/core'

export default {
  name: 'admin',

  components: {
  },

  data() {
    return {
      // aTenants: [
      //   { name: 'Default', id: 1 },
      //   { name: 'Business', id: 2 },
      //   { name: 'Other', id: 3 },
      // ],
      // sSelectedTenantId: 1,
    }
  },

  computed: {
    showHeader: function () {
      return this.$store.getters['user/isUserSuperAdmin']
    },
    selectedTenantName () {
      return 'Default'
    },
  },

  watch: {
  },

  methods: {
    proceedLogout () {
      core.logout()
    },
  },
}
</script>
