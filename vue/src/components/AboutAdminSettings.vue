<template>
  <q-scroll-area class="full-height full-width">
    <div class="q-pa-lg" style="min-width: 800px">
      <div class="row q-mb-md">
        <div class="col text-h5">{{ $t('ADMINPANELWEBCLIENT.HEADING_ABOUT_SETTINGS') }}</div>
      </div>
      <q-card flat bordered class="card-edit-settings">
        <q-card-section>
          <div class="row">
            <div class="col-2 q-my-sm q-ml-md grey-7" v-t="'ADMINPANELWEBCLIENT.LABEL_PRODUCT_NAME'"></div>
            <div class="col-4 q-my-sm q-ml-sm">{{ productName }}</div>
          </div>
          <div class="row">
            <div class="col-2 q-my-sm q-ml-md grey-7" v-t="'ADMINPANELWEBCLIENT.LABEL_PRODUCT_VERSION'"></div>
            <div class="col-4 q-my-sm q-ml-sm">{{ version }}</div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-scroll-area>
</template>

<script>
import settings from 'src/settings'

export default {
  name: 'AboutAdminSettings',
  data() {
    return {
      version: '',
      productName: ''
    }
  },
  mounted () {
    this.populate()
  },
  methods: {
    populate () {
      const data = settings.getAboutSettings()
      this.version = data.version
      this.productName = data.productName
    }
  }
}
</script>

<style scoped>

</style>
