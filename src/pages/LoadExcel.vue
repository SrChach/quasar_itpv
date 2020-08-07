<template>
  <q-page class="flex flex-center">
    <div class="row justify-center items-center">
      <div class="col-12">
        <q-chip v-if="(productos.length < 1)" color="red" text-color="white" icon="warning" label="No has seleccionado nada" />
        <q-chip v-else color="green" text-color="white" icon="check_circle" label="Datos del excel cargados" />
      </div>
      <div class="col-12 col-sm-6 q-pa-md q-gutter-sm">
        <componente-de-excel v-show="!isSending" @change-excel="setProductsData"/>
        <q-spinner-hourglass size="md" v-show="isSending" color="secondary"/>
      </div>
      <div class="col-12 col-sm-6 q-pa-md q-gutter-sm">
        <q-btn v-if="!isSending" color="primary" label="Cargar datos" icon-right="add_circle" @click="insertData()"/>
        <span v-else>Esperando a que se inserten los productos</span>
      </div>
      <div class="col-12 col-sm-8 q-pa-md q-gutter-sm">
        <q-expansion-item
          expand-separator
          icon="error"
          label="Hubo errores al insertar"
          header-class="bg-red text-white"
          v-if="errors.length > 0"
        >
          <q-list bordered separator>
            <q-item v-ripple v-for="(error, i) in errors" :key="i">
              <q-item-section>
                <q-item-label overline>Error en la fila: {{ error.arrayId + 2 }}</q-item-label>
                <q-item-label>{{ error.error }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
      </div>
    </div>
  </q-page>
</template>

<script>
/** Utils */
import { cleanExcelData, reverseChanges, saveExcel } from '../utils/process-array-excel.js'

/** Components */
import load from '../components/ExcelComponent'

export default {
  name: 'PageIndex',
  data: function () {
    return {
      productos: [],
      isSending: false,
      errors: [],
      headerConfig: [ // codigo de barras: ID: [ID, CODE]
        { match: val => /sku/i.test(val), databaseName: 'REFERENCE', col: 'SKU' },
        { match: val => /c[oó]digo(.*)barras/i.test(val), databaseName: 'ID', col: 'CODIGO DE BARRAS' },
        { match: val => /descripci[oó]n/i.test(val), databaseName: 'NAME', col: 'DESCRIPCIÓN' },
        { match: val => /precio(.*)compra/i.test(val), databaseName: 'PRICEBUY', changes: val => Number(val), col: 'PRECIO COMPRA' },
        { match: val => /precio(.*)venta/i.test(val), databaseName: 'PRICESELL', changes: val => Number(val), col: 'PRECIO VENTA ANTES DE IMP' },
        { match: val => /unidad(.*)medida(.*)sat/i.test(val), databaseName: 'MEDIDA', col: 'UNIDAD DE MEDIDA SAT' },
        { match: val => /proveedor/i.test(val), databaseName: 'PROVEEDOR', col: 'PROVEEDOR' },
        { match: val => /marca/i.test(val), databaseName: 'MARCA', COL: 'MARCA' },
        { match: val => /precio(.*)2/i.test(val), databaseName: 'PRICESELL2', changes: val => Number(val), col: 'PRECIO 2' },
        { match: val => /precio(.*)3/i.test(val), databaseName: 'PRICESELL3', changes: val => Number(val), col: 'PRECIO 3' },
        { match: val => /precio(.*)4/i.test(val), databaseName: 'PRICESELL4', changes: val => Number(val), col: 'PRECIO 4' },
        { match: val => /precio(.*)5/i.test(val), databaseName: 'PRICESELL5', changes: val => Number(val), col: 'PRECIO 5' },
        { match: val => /precio(.*)6/i.test(val), databaseName: 'PRICESELL6', changes: val => Number(val), col: 'PRECIO 6' },
        { match: val => /precio(.*)7/i.test(val), databaseName: 'PRICESELL7', changes: val => Number(val), col: 'PRECIO 7' },
        { match: val => /precio(.*)8/i.test(val), databaseName: 'PRICESELL8', changes: val => Number(val), col: 'PRECIO 8' },
        { match: val => /clave(.*)producto(.*)SAT/i.test(val), databaseName: 'SERIE', col: 'CLAVE DE PRODUCTO SAT' },
        { match: val => /l[ií]nea/i.test(val), databaseName: 'MODELO', col: 'LINEA' },
        { match: val => /monedero/i.test(val), databaseName: 'MONEDERO', changes: val => Number(val), col: 'PORCENTAJE MONEDERO' }
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
      this.errors = []
    },
    insertData () {
      if (this.productos.length < 1) {
        this.$q.notify({ type: 'negative', message: 'Carga algo en el excel antes' })
        return
      }
      this.$q.electron.ipcRenderer.send('call-insert-products', this.productos, true)
      this.isSending = true
    },
    informResult (e, res) {
      /** For template configuration */
      this.isSending = false
      this.errors = res

      /** Filtering to get original stylesheet but just witj errored rows */
      const failed = this.filterFailed(this.productos, res)
      const original = reverseChanges(failed, this.headerConfig)

      console.log({ failed, original })

      const createdStatus = saveExcel(original, `${process.env.HOME}/template_productos_itpv.xlsx`, 'Productos')
      const typeAlert = (createdStatus.error === undefined) ? 'positive' : 'negative'
      this.$q.notify({ type: typeAlert, message: createdStatus.message })
    },
    filterFailed (products = [], allErrors = []) {
      const arr = allErrors.map(o => products[o.arrayId])
      return arr
    }
  },
  components: {
    'componente-de-excel': load
  }
}
</script>
