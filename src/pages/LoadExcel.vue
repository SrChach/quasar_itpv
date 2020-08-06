<template>
  <q-page class="flex flex-center">
    <div class="row justify-center items-center">
      <div class="col-12 col-sm-6 q-pa-md q-gutter-sm">
        <componente-de-excel @change-excel="setProductsData"/>
      </div>
      <div class="col-12 col-sm-6 q-pa-md q-gutter-sm">
        <q-btn color="primary" label="Cargar datos" icon-right="add_circle" @click="insertData()"/>
      </div>
      <div class="col-12">
        <pre>{{ (productos !== null) ? productos : 'No has seleccionado nada' }}</pre>
      </div>
    </div>
  </q-page>
</template>

<script>
/** Components */
import load from '../components/ExcelComponent'

export default {
  name: 'PageIndex',
  data: function () {
    return {
      productos: null
    }
  },
  created () {
    this.$q.electron.ipcRenderer.on('responder-insertar-template', this.informResult)
  },
  destroyed () {
    this.$q.electron.ipcRenderer.removeListener('responder-insertar-template', this.informResult)
  },
  methods: {
    setProductsData (data) {
      this.productos = data
    },
    insertData () {
      for (let i = 1; i < this.productos.length; i++) {
        // console.log(this.productos[i])
        this.$q.electron.ipcRenderer.send('llamar-insertar-template', this.productos[i], 1)
      }
    },
    informResult (e, res) {
      console.log(res)
    }
  },
  components: {
    'componente-de-excel': load
  }
}
</script>
