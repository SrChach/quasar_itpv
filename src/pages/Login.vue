<template>
  <q-page class="flex flex-center justify-center">
    <div class="q-pa-md">
      <h2>Iniciar sesión</h2>
      <span><b>Nota:</b> Solo para uso del administrador</span>
      <q-form
        @submit="check_credentials"
        @reset="onReset"
        class="q-gutter-md"
      >
        <q-input
          filled
          type="password"
          v-model="password"
          label="Contraseña"
          lazy-rules
        />

        <div>
          <q-btn label="Entrar" type="submit" color="primary"/>
          <q-btn label="Limpiar" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      password: ''
    }
  },
  created () {
    /** if !localStorage.getItem('hashed-pwd') &&  */
    this.$q.electron.ipcRenderer.on('response-check-admin', this.get_auth_user)
  },
  beforeDestroy () {
    this.$q.electron.ipcRenderer.removeListener('response-check-admin', this.get_auth_user)
  },
  methods: {
    get_auth_user (event, response) {
      if (response.error !== null && response.error !== undefined) {
        this.$q.notify({ type: 'negative', message: response.error })
        return 0
      }
      const encrypted = response.data
      const options = {
        color: 'red-4',
        textColor: 'white',
        icon: 'report_problem',
        message: 'Password incorrecto. Chequelo en la aplicación de ITPV'
      }

      var isSuccesful = false
      if (typeof encrypted === 'string') {
        isSuccesful = this.validate_user(encrypted)
      }
      if (isSuccesful) {
        options.color = 'green-4'
        options.icon = 'cloud_done'
        options.message = 'Bienvenido!'
        this.$router.push('/')
      }
      this.$q.notify(options)
    },

    validate_user (encrypted) {
      /** Solo será válido para SHA1 */
      this.$store.commit('security/setIsAuthenticated', encrypted)
      return this.isAuthenticated
    },

    check_credentials () {
      this.$q.electron.ipcRenderer.send('call-check-admin', this.password)
    },

    onReset () {
      this.password = ''
    }
  },

  computed: {
    isAuthenticated () { return this.$store.getters['security/getIsAuthenticated'] }
  }
}
</script>
