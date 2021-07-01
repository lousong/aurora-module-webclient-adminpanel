<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App',

  data() {
    return {
    }
  },

  meta () {
    return {
      title: this.siteName
    }
  },

  mounted () {
    this.setRoute()
  },

  computed: {
    isUserSuperAdmin: function () {
      return this.$store.getters['user/isUserSuperAdmin']
    },
    siteName: function () {
      return this.$store.getters['main/getSiteName']
    },
  },

  watch: {
    isUserSuperAdmin: function () {
      this.setRoute()
    },
  },

  methods: {
    setRoute () {
      const currentPath = this.$router.currentRoute && this.$router.currentRoute.path ? this.$router.currentRoute.path : ''
      const newPath = this.isUserSuperAdmin ? '/system' : '/'
      if (currentPath !== newPath) {
        this.$router.push({ path: newPath })
      }
    }
  }
}
</script>
