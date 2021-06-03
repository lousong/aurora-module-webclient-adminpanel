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
                        :class="currentRouteName === item.name ? 'bg-selected-item text-white' : ''"
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
          <router-view></router-view>
        </template>
      </q-splitter>
    </q-page>
  </q-page-container>
</template>

<script>
import _ from 'lodash'

import modulesManager from 'src/modules-manager'
import settings from 'src/settings'

import typesUtils from 'src/utils/types'

export default {
  name: 'system',

  data() {
    return {
      tabs: [],

      splitterWidth: 20,

      currentRouteName: '',
    }
  },

  watch: {
    $route(to, from) {
      this.currentRouteName = to.name
    }
  },

  mounted () {
    const tabsOrder = settings.getTabsOrder()
    let tabs = modulesManager.getAdminSystemTabs()
    if (typesUtils.isNonEmptyArray(tabs)) {
      tabs = _.sortBy(tabs, (tab) => {
        const index = _.indexOf(tabsOrder, tab.name)
        return index !== -1 ? index : tabsOrder.length
      })
      this.tabs = tabs
      _.each(tabs, (tab) => {
        if (typesUtils.isNonEmptyArray(tab.paths)) {
          tab.paths.forEach(path => {
            this.$router.addRoute('system', { path, name: tab.name, component: tab.component })
          })
        } else {
          this.$router.addRoute('system', { path: tab.name, name: tab.name, component: tab.component })
        }
      })
      this.changeTab(tabs[0].name)
    }
  },

  methods: {
    changeTab (tabName) {
      const currentPath = this.$router.currentRoute && this.$router.currentRoute.path ? this.$router.currentRoute.path : ''
      const newPath = '/system/' + tabName
      if (currentPath !== newPath) {
        this.$router.push(newPath)
      } else {
        this.currentRouteName = tabName
      }
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
