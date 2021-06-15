<template>
  <q-scroll-area class="full-height full-width relative-position">
    <q-list>
      <div v-for="item in items" :key="item.id">
        <q-item clickable @click="selectItem(item.id)"
                :class="getCssClass(item.id, item.checked)"
        >
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
</template>

<script>
export default {
  name: 'StandardList',

  props: {
    items: Array,
    selectedItem: Number,
    hasCheckedItems: Boolean,
    loading: Boolean,
  },

  data () {
    return {
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
    checkedIds () {
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
    getCssClass (id, checked) {
      if (this.selectedItem === id) {
        return 'bg-selected-item'
      }
      if (checked) {
        return 'bg-checked-item'
      }
      return ''
    },
    selectItem (id) {
      this.$emit('select', id)
    },
  },
}
</script>

<style scoped>

</style>
