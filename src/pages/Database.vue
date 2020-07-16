<template>
  <q-page class="flex flex-center justify-center">
    <div class="q-pa-md" style="max-width: 400px" v-if="$q.platform.is.electron">
      <q-form
        @submit="save_product"
        @reset="onReset"
        class="q-gutter-md"
      >
        <q-input
          filled
          v-model="product.name"
          label="Nombre del producto *"
          hint="Producto"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Escribe un nombre' ]"
        />

        <q-input
          filled
          type="number"
          v-model="product.price"
          label="Precio *"
          lazy-rules
          :rules="[
            val => val !== null && val !== '' || 'Inserta un precio',
            val => val > 0 && val < 10000 || 'Inserta un precio válido'
          ]"
        />

        <q-input
          filled
          v-model="product.description"
          label="Descripcion del producto *"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Escribe una descripcion']"
        />

        <div>
          <q-btn label="Submit" type="submit" color="primary"/>
          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
      <div>
        <h4>Datos de BD(Requiere dump de ITPV y configuracion de src-electron.database.js):</h4><br>
        <pre>{{ retrieved_products }}</pre>
      </div>
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
      console.log({ event, res })
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
    },

    onReset () {
      this.product.name = null
      this.product.price = null
      this.product.description = null
    }
  }
}
</script>
