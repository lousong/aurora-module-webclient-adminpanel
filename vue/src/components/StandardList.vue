<template>
  <div class="flex column">
    <q-list class="col-auto bg-grey-3">
      <q-item>
        <q-item-section side>
          <q-checkbox dense v-model="hasCheckedItems" />
        </q-item-section>
        <q-item-section>
          <q-input rounded outlined dense v-model="enteredSearch" @keyup.enter="startSearch">
            <template v-slot:append>
              <q-btn dense flat :ripple="false" icon="search" @click="startSearch" />
            </template>
          </q-input>
        </q-item-section>
      </q-item>
      <q-separator />
    </q-list>
    <q-scroll-area class="col-grow relative-position">
      <div v-if="search" class="text-right">
        <q-btn dense flat no-caps color="primary" class="no-hover" :label="$t('COREWEBCLIENT.ACTION_CLEAR_SEARCH')"
               @click.native.stop="clearSearch"/>
      </div>
      <div v-if="search" class="text-center text-h6 text-grey-5 text-weight-regular">
        {{ $tc('ADMINPANELWEBCLIENT.INFO_SEARCH_RESULT', search, { SEARCH: search }) }}
      </div>
      <q-list>
        <div v-for="item in items" :key="item.id">
          <q-item clickable @click="selectItem(item.id)" :class="getCssClass(item.id, item.checked)">
            <q-item-section side>
              <q-checkbox dense v-model="item.checked" />
            </q-item-section>
            <q-item-section>
              <q-item-label lines="1">{{ item.title }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator />
        </div>
      </q-list>
      <q-inner-loading :showing="loading">
        <q-spinner size="50px" color="primary" />
      </q-inner-loading>
    </q-scroll-area>
    <q-list class="col-auto">
      <q-item>
        <q-item-section>
          <span>{{ totalCountText }}</span>
        </q-item-section>
        <q-item-section side v-if="pagesCount > 1">
          <q-pagination flat active-color="primary" color="grey-6" v-model="selectedPage" :max="pagesCount" />
        </q-item-section>
      </q-item>
      <q-separator />
    </q-list>
  </div>
</template>

<script>
export default {
  name: 'StandardList',

  props: {
    items: Array,
    selectedItem: Number,
    loading: Boolean,
    totalCountText: String,

    search: String,
    page: Number,
    pagesCount: Number,
  },

  data () {
    return {
      hasCheckedItems: false,
      enteredSearch: '',
      selectedPage: 1,
    }
  },

  computed: {
    checkedIds () {
      const checked = this.items.filter(item => {
        return item.checked
      })
      return checked.map(item => {
        return item.id
      })
    },
  },

  watch: {
    search () {
      this.enteredSearch = this.search
    },

    selectedPage () {
      this.$emit('route')
    },

    page () {
      this.selectedPage = this.page
    },

    checkedIds () {
      this.hasCheckedItems = this.checkedIds.length > 0
      this.$emit('check', this.checkedIds)
    },

    hasCheckedItems () {
      if (this.hasCheckedItems === false && this.checkedIds.length > 0) {
        this.items.forEach(item => {
          item.checked = false
        })
      }
      if (this.hasCheckedItems === true && this.checkedIds.length === 0) {
        this.items.forEach(item => {
          item.checked = true
        })
      }
    },
  },

  methods: {
    startSearch () {
      this.$emit('route')
    },

    clearSearch () {
      this.enteredSearch = ''
      this.startSearch()
    },

    selectItem (id) {
      this.$emit('route', id)
    },

    getCssClass (id, checked) {
      if (this.selectedItem === id) {
        return 'bg-selected-item'
      }
      if (checked) {
        return 'bg-checked-item'
      }
      return ''
    },

    decreasePage() {
      this.selectedPage -= 1
    },
  },
}
</script>

<style scoped>

</style>
