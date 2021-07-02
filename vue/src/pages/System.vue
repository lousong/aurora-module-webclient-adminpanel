<template>
  <q-splitter after-class="q-splitter__right-panel" class="full-height full-width" v-model="splitterWidth"
              :limits="[10,30]">
    <template v-slot:before>
      <q-scroll-area class="full-height full-width">
        <q-list>
          <div v-for="item in tabs" :key="item.tabName">
            <q-item clickable @click="changeTab(item.tabName)"
                    :class="currentRouteName === item.tabName ? 'bg-selected-item text-white' : ''"
            >
              <q-item-section>
                <q-item-label lines="1">{{ $t(item.title) }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-separator/>
          </div>
        </q-list>
      </q-scroll-area>
    </template>
    <template v-slot:after>
      <router-view></router-view>
    </template>
  </q-splitter>
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
      this.currentRouteName = this.getRouteName(to.fullPath)
    },
    tabs () {
      // executed in "watch" to avoid errors, if "mounted" an error occurs
      this.changeTab(this.tabs[0].tabName)
    }
  },

  mounted () {
    const tabsOrder = settings.getTabsOrder()
    let tabs = modulesManager.getAdminSystemTabs(this.$router)
    if (typesUtils.isNonEmptyArray(tabs)) {
      tabs = _.sortBy(tabs, (tab) => {
        const index = _.indexOf(tabsOrder, tab.tabName)
        return index !== -1 ? index : tabsOrder.length
      })
      this.tabs = tabs
    }
  },
  methods: {
    getRouteName (fullPath) {
      return fullPath.split('/')[fullPath.split('/').length - 1]
    },
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
