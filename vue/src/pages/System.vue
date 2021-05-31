<template>
  <q-page-container style="height: 100vh">
    <q-page class="flex flex-stretch full-height">
      <q-splitter class="full-height full-width" separator-class="main-split-separator"
                  v-model="splitterWidth" :limits="[10,30]">
        <template v-slot:before>
          <q-scroll-area class="full-height full-width">
            <q-list>
              <div v-for="item in tabs" :key="item.name">
                <q-item clickable @click="changeTab(item.name)"
                        :class="sSelectedTab === item.name ? 'bg-selected-item text-white' : ''"
                >
                  <q-item-section>
                    <q-item-label lines="1">{{ $t(item.title) }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator />
              </div>
            </q-list>
          </q-scroll-area>
        </template>
        <template v-slot:after>
          <component :is="tabComponent" />
        </template>
      </q-splitter>
    </q-page>
  </q-page-container>
</template>

<script>
import _ from 'lodash'

import modulesManager from 'src/modules-manager'
import settings from 'src/settings'

export default {
  name: 'system',

  components: {
  },

  data() {
    return {
      tabs: [],

      splitterWidth: 20,

      sSelectedTab: 'admin-security',
    }
  },

  computed: {
    tabComponent () {
      const sSelectedTab = this.sSelectedTab
      const oTabData = _.find(this.tabs, function (tab) {
        return tab.name === sSelectedTab
      })
      if (oTabData) {
        return oTabData.component
      }
      return null
    },
  },

  watch: {
    splitterWidth () {
      console.log('splitterWidth', this.splitterWidth)
    }
  },

  mounted () {
    const tabsOrder = settings.getTabsOrder()
    let tabs = modulesManager.getAdminSystemTabs()
    tabs = _.sortBy(tabs, (tab) => {
      const index = _.indexOf(tabsOrder, tab.name)
      return index !== -1 ? index : tabsOrder.length
    })
    this.tabs = tabs
  },

  methods: {
    changeTab (tabName) {
      this.sSelectedTab = tabName
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
