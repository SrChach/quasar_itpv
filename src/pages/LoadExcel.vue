<template>
  <div>
    <q-page class="flex flex-center" v-if="errors.length < 1">
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
          <q-btn v-if="!isSending" color="primary" label="Cargar datos" icon="add_circle" @click="insertData()" />
          <span v-else>Esperando a que se inserten los productos</span>
        </div>
      </div>
    </q-page>
    <q-page v-if="errors.length > 0">
      <excel-errors
        :errors="errors"
        :config="headerConfig"
        :rows="productos"
        :saveTo="saveTo"
        sheetTitle="Productos"
        @close="reset()"
      />
    </q-page>
  </div>
</template>

<script>
/** Utils */
import { cleanExcelData } from '../utils/process-array-excel.js'

/** Components */
import load from '../components/ExcelComponent'
import excelErrors from '../components/ExcelErrors'

export default {
  name: 'PageIndex',
  data: function () {
    return {
      productos: [],
      isSending: false,
      errors: [],
      saveTo: `${process.env.HOMEPATH || process.env.HOME}/template_productos_itpv.xlsx`,
      headerConfig: [ // codigo de barras: ID: [ID, CODE]
        { match: val => /sku/i.test(val), databaseName: 'REFERENCE', col: 'SKU' },
        { match: val => /c[oó]digo(.*)barras/i.test(val), databaseName: 'ID', col: 'CODIGO DE BARRAS' },
        { match: val => /descripci[oó]n/i.test(val), databaseName: 'NAME', col: 'DESCRIPCIÓN' },
        { match: val => /precio(.*)compra/i.test(val), databaseName: 'PRICEBUY', changes: val => Number(val), col: 'PRECIO COMPRA' },
        { match: val => /precio(.*)venta/i.test(val), databaseName: 'PRICESELL', changes: val => Number(val), col: 'PRECIO VENTA ANTES DE IMP' },
        { match: val => /unidad(.*)medida(.*)sat/i.test(val), databaseName: 'MEDIDA', col: 'UNIDAD DE MEDIDA SAT' },
        { match: val => /proveedor/i.test(val), databaseName: 'PROVEEDOR', col: 'PROVEEDOR' },
        { match: val => /marca/i.test(val), databaseName: 'MARCA', col: 'MARCA' },
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
    this.$q.electron.ipcRenderer.on('response-insert-products', this.manageResponse)
  },
  destroyed () {
    this.$q.electron.ipcRenderer.removeListener('response-insert-products', this.manageResponse)
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
    manageResponse (e, res) {
      /** For template configuration */
      this.isSending = false
      this.errors = res

      this.$q.notify({
        type: 'info',
        message: 'Productos cargados. Cualquier error le será notificado'
      })
    },
    reset () {
      this.errors = []
      this.productos = []
    }
  },
  components: {
    'componente-de-excel': load,
    'excel-errors': excelErrors
  }
}
</script>
