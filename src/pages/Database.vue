<template>
  <q-page class="flex flex-center justify-center">
    <div class="q-pa-md" style="max-width: 400px" v-if="$q.platform.is.electron">
      <h4>Datos de BD(Requiere dump de ITPV y configuracion de src-electron.database.js):</h4><br>
      <pre>{{ retrieved_products }}</pre>
    </div>
    <h3 v-else>
      Este módulo solo funciona en escritorio
    </h3>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      product: {
        name: null,
        price: null,
        description: null
      },
      retrieved_products: null
    }
  },
  created () {
    if (this.$q.platform.is.electron) {
      this.$q.electron.ipcRenderer.send('call-get-products', 'some message')
      this.$q.electron.ipcRenderer.on('response-test-connection', this.list_products)
    }
  },
  beforeDestroy () {
    if (this.$q.platform.is.electron) {
      this.$q.electron.ipcRenderer.removeListener('response-test-connection', this.list_products)
    }
  },
  methods: {
    list_products (event, res) {
      this.retrieved_products = res
    },
    save_product () {
      const product = JSON.parse(JSON.stringify(this.product))
      this.$q.electron.ipcRenderer.send('call-insert-products', product)
      this.$q.electron.ipcRenderer.on('response-insert-products', (event, arg) => {
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Submitted'
        })
      })
    }
  }
}
</script>
