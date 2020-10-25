<template>
  <q-page class="flex flex-center justify-center">
    <div class="q-pa-md">
      <h2>Activar ITPV</h2>
      <q-form
        class="q-gutter-md"
        @submit="activateSerial"
        @reset="onReset"
      >

        <q-input
          filled
          type="text"
          v-model="name"
          label="Tu nombre"
          lazy-rules
        />

        <q-input
          filled
          type="text"
          v-model="code"
          label="Codigo de activacion"
          mask="aaaa-aaaa-aaaa"
          hint="Ejemplo: aaaa-aaaa-aaaa"
        />

        <div>
          <q-btn label="Activar" type="submit" color="primary"/>
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
      code: '',
      name: '',
      existsDBConnection: false
    }
  },
  created () {
    this.$q.electron.ipcRenderer.on('response-check-db', this.checkDBConnection)
    this.$q.electron.ipcRenderer.send('call-check-db')
  },
  beforeDestroy () {
    this.$q.electron.ipcRenderer.removeListener('response-check-db', this.checkDBConnection)
  },
  methods: {
    checkDBConnection (event, response) {
      this.existsDBConnection = response
    },
    async checkSerial (code = '', name = '') {
      try {
        const response = await fetch(`http://smgpuntosdeventa.net/itpv_validate/?code=${code}&name=${name}`)
        const data = await response.json()
        return data
      } catch (error) {
        const err = /failed(.*)fetch/i.test(error) ? 'Comprueba tu conexión a Internet' : error
        return { error: err }
      }
    },
    async activateSerial () {
      if (!this.existsDBConnection) {
        this.$q.electron.ipcRenderer.send('call-check-db')
        this.$q.notify({
          type: 'negative',
          message: 'Comprueba antes que tu iTPV esté abierto, y vuelve a intentarlo'
        })
        return
      }
      const res = await this.checkSerial(this.code, this.name)
      if (res.error != null) {
        this.$q.notify({ type: 'negative', message: `Ha ocurrido un error: ${res.error}` })
      } else {
        this.$q.notify({ type: 'positive', message: res.data.message })
        this.$store.commit('security/setIsActivated', res.data.code)
        this.$router.push('/')
      }
    },

    onReset () {
      this.code = ''
      this.name = ''
    }
  }
}
</script>
