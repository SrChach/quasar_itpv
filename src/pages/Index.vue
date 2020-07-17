<template>
  <q-page class="flex flex-center justify-center">
    <div class="q-pa-md" v-if="$q.platform.is.electron">
      <h2>ITPV - Login</h2>
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
          label="Contraseña *"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Escribe una contraseña' ]"
        />

        <div>
          <q-btn label="Submit" type="submit" color="primary"/>
          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </div>
    <div class="q-pa-md" v-else>
      <h4>Lo sentimos, esta aplicación está diseñada solo para Escritorio y Móvil</h4>
    </div>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      password: null
    }
  },
  created () {
    if (!localStorage.getItem('hashed-pwd') && this.$q.platform.is.electron) {
      this.$q.electron.ipcRenderer.on('response-check-admin', this.get_auth_user)
    }
  },
  beforeDestroy () {
    if (this.$q.platform.is.electron) {
      this.$q.electron.ipcRenderer.removeListener('response-check-admin', this.get_auth_user)
    }
  },
  methods: {
    get_auth_user (event, res) {
      const options = {
        color: 'red-4',
        textColor: 'white',
        icon: 'report_problem',
        message: 'incorrect password'
      }

      if (res.length === 1) {
        options.color = 'green-4'
        options.icon = 'cloud_done'
        options.message = 'Founded!'
        const encrypted = res[0].APPPASSWORD
        localStorage.setItem('secure-key', encrypted)
      }
      this.$q.notify(options)
    },

    check_credentials () {
      this.$q.electron.ipcRenderer.send('call-check-admin', this.password)
    },

    onReset () {
      this.password = null
    }
  }
}
</script>
