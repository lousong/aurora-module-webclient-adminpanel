<template>
  <q-page-container style="height: 100vh">
    <q-page class="flex flex-center login-page">
      <div class="q-pa-md">
        <div class="q-gutter-y-md column" style="width: 240px">
          <q-input bg-color="white" standout="bg-yellow-2" outlined dense v-model="login"
                   :placeholder="$t('COREWEBCLIENT.LABEL_LOGIN')" @keyup.enter="proceedLogin">
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>

          <q-input class="q-mt-none" bg-color="white" standout="bg-yellow-2" outlined dense v-model="password"
                   type="password" :placeholder="$t('COREWEBCLIENT.LABEL_PASSWORD')" @keyup.enter="proceedLogin">
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
          </q-input>

          <q-btn unelevated no-caps outline bg-color="primary" class="q-px-sm bg-primary" :ripple="false"
                 color="white" :loading="loading" @click="proceedLogin">
            {{$t('COREWEBCLIENT.ACTION_SIGN_IN')}}
            <template v-slot:loading>
              {{$t('COREWEBCLIENT.ACTION_SIGN_IN_IN_PROGRESS')}}
            </template>
          </q-btn>
        </div>
      </div>
    </q-page>
  </q-page-container>
</template>

<script>
import _ from 'lodash'

import core from 'src/core'

import errors from 'src/utils/errors'
import notification from 'src/utils/notification'
import webApi from 'src/utils/web-api'

export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      login: '',
      password: '',
    }
  },
  methods: {
    proceedLogin () {
      if (!this.loading) {
        this.loading = true
        webApi.sendRequest({
          moduleName: 'Core',
          methodName: 'Login',
          parameters: {
            Login: this.login,
            Password: this.password,
          },
        }).then(result => {
          this.loading = false
          if (_.isObject(result) && _.isString(result.AuthToken)) {
            core.setAuthToken(result.AuthToken)
          } else {
            notification.showError(this.$t('COREWEBCLIENT.ERROR_PASS_INCORRECT'))
          }
        }, responce => {
          this.loading = false
          notification.showError(errors.getTextFromResponse(responce, this.$t('COREWEBCLIENT.ERROR_PASS_INCORRECT')))
        })
      }
    },
  }
}
</script>
