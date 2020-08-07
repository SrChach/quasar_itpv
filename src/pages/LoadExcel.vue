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
/** Utils */
import cleanExcelData from '../utils/process-array-excel.js'

/** Components */
import load from '../components/ExcelComponent'

export default {
  name: 'PageIndex',
  data: function () {
    return {
      productos: null,
      headerConfig: [ // codigo de barras: ID: [ID, CODE]
        { match: val => /^sku$/i.test(val), databaseName: 'REFERENCE' },
        { match: val => /^c[oó]digo(.*)de(.*)barras$/i.test(val), databaseName: 'ID' },
        { match: val => /^descripci[oó]n$/i.test(val), databaseName: 'NAME' },
        { match: val => /^precio compra$/i.test(val), databaseName: 'PRICEBUY', changes: val => Number(val) },
        { match: val => /^precio venta antes de imp$/i.test(val), databaseName: 'PRICESELL', changes: val => Number(val) },
        { match: val => /^unidad de medida sat$/i.test(val), databaseName: 'MEDIDA' },
        { match: val => /proveedor/i.test(val), databaseName: 'PROVEEDOR' },
        { match: val => /^marca$/i.test(val), databaseName: 'MARCA' },
        { match: val => /^precio 2$/i.test(val), databaseName: 'PRICESELL2', changes: val => Number(val) },
        { match: val => /^precio 3$/i.test(val), databaseName: 'PRICESELL3', changes: val => Number(val) },
        { match: val => /^precio 4$/i.test(val), databaseName: 'PRICESELL4', changes: val => Number(val) },
        { match: val => /^precio 5$/i.test(val), databaseName: 'PRICESELL5', changes: val => Number(val) },
        { match: val => /^precio 6$/i.test(val), databaseName: 'PRICESELL6', changes: val => Number(val) },
        { match: val => /^precio 7$/i.test(val), databaseName: 'PRICESELL7', changes: val => Number(val) },
        { match: val => /^precio 8$/i.test(val), databaseName: 'PRICESELL8', changes: val => Number(val) },
        { match: val => /^clave de producto SAT$/i.test(val), databaseName: 'SERIE' },
        { match: val => /^l[ií]nea$/i.test(val), databaseName: 'MODELO' },
        { match: val => /^porcentaje monedero$/i.test(val), databaseName: 'MONEDERO', changes: val => Number(val) }
        /** { validator: val => true } */
      ]
    }
  },
  created () {
    this.$q.electron.ipcRenderer.on('response-insert-products', this.informResult)
  },
  destroyed () {
    this.$q.electron.ipcRenderer.removeListener('response-insert-products', this.informResult)
  },
  methods: {
    setProductsData (data) {
      const allInserts = cleanExcelData(data, this.headerConfig)
      allInserts.forEach(obj => { obj.CODE = obj.ID })
      this.productos = allInserts
    },
    insertData () {
      this.$q.electron.ipcRenderer.send('call-insert-products', this.productos, true)
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
