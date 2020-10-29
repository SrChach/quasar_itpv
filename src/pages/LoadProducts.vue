<template>
  <div>
    <q-page class="flex flex-center" v-if="errors.length < 1">
      <div class="row justify-center items-center">
        <div class="col-10 q-mb-md">
          <h4 class="text-primary q-mb-sm" align="center"><q-icon name="tapas"/> PRODUCTOS - CARGA MASIVA</h4>
          <p align="center">
            <b class="text-h6 text-primary">1.-</b> Descargue la plantilla ejemplo y llene los datos solicitados. La plantilla se descargara en su escritorio&nbsp;
            <br><br>
            <q-btn outline label="Descargar" color="primary" icon="save" @click="copyTemplate()"/>
            <br>
            <b class="text-h6 text-primary">2.-</b> Seleccione la ubicacion de la plantilla con todos los datos de sus productos
          </p>
        </div>
        <div class="col-12 col-sm-12 q-pa-md q-gutter-sm">
          <div v-show="!isSending">
            <p align="center">
              <q-chip v-if="(productos.length < 1)" color="red" text-color="white" icon="warning" label="Selecciona un archivo con formato válido" />
              <q-chip v-else color="green" text-color="white" icon="check_circle" label="Datos del excel cargados" />
              <componente-de-excel @change-excel="setProductsData"/>
            </p>
          </div>
          <q-spinner-hourglass size="md" v-show="isSending" color="secondary"/>
        </div>
        <div v-if="productos.length > 0" class="col-12 col-sm-12 q-pa-md q-gutter-sm">
         <p align="center">
            <b class="text-h6 text-primary">3.-</b> Presione el boton "CARGAR DATOS" para iniciar la carga masiva a iTPV 3.0
            <br><br>
            <q-btn v-if="!isSending" color="primary" label="Cargar datos" icon="add_circle" @click="insertData()" />
            <span v-else>Esperando a que se inserten los productos</span>
         </p>
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
import fs from 'fs'
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
      saveTo: 'corregir_productos_itpv.xlsx',
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
        { match: val => /monedero/i.test(val), databaseName: 'MONEDERO', changes: val => Number(val), col: 'PORCENTAJE MONEDERO' },
        { match: val => /existencias/i.test(val), databaseName: 'UNITS', changes: val => (val !== '') ? Number(val) : val, col: 'EXISTENCIAS' },
        { match: val => /stock(.*)m[ií]nimo/i.test(val), databaseName: 'STOCKSECURITY', changes: val => (val !== '') ? Number(val) : val, col: 'STOCK MINIMO' },
        { match: val => /stock(.*)m[aá]ximo/i.test(val), databaseName: 'STOCKMAXIMUM', changes: val => (val !== '') ? Number(val) : val, col: 'STOCK MAXIMO' },
        { match: val => /categor[ií]a(.*)de(.*)impuesto/i.test(val), databaseName: 'TAXCAT', default: 'IVA', changes: val => (/(.*)IVA(.*)/i.test(val)) ? '001' : '000', col: 'CATEGORIA DE IMPUESTO' },
        { match: val => /producto(.*)a(.*)granel/i.test(val), databaseName: 'ISSCALE', changes: val => (/(.*)SI(.*)/i.test(val)) ? 1 : 0, col: 'PRODUCTO A GRANEL' }
        /** { validator: val => true } */
      ]
    }
  },
  created () {
    this.$q.electron.ipcRenderer.on('response-insert-products', this.manageResponse)
    this.saveTo = this.getSaveDirectory('corregir_productos_itpv.xlsx')
  },
  destroyed () {
    this.$q.electron.ipcRenderer.removeListener('response-insert-products', this.manageResponse)
  },
  methods: {
    copyTemplate () {
      const bookRoute = __statics + '/excel/template-productos.xlsx'
      const copyTo = this.getSaveDirectory('template-original-productos.xlsx')
      if (fs.existsSync(copyTo)) {
        this.$q.notify({ type: 'negative', message: `Ya existe un archivo en ${copyTo}. Cambie o mueva ese archivo para poder descargar la plantilla` })
        return
      }
      fs.copyFile(bookRoute, copyTo, (err) => {
        if (err) {
          this.$q.notify({ type: 'negative', message: `oops! No se pudo guardar. Error: ${err}` })
          return
        }
        this.$q.notify({ type: 'positive', message: `Plantilla guardada en ${copyTo}` })
      })
    },
    getSaveDirectory (filename) {
      const homepath = process.env.HOMEPATH || process.env.HOME
      if (this.$q.platform.is.linux) return `${homepath}/${filename}`
      return `${homepath}/Desktop/${filename}`
    },
    setProductsData (data) {
      const allInserts = cleanExcelData(data, this.headerConfig)
      allInserts.forEach(obj => { obj.CODE = obj.ID })
      this.productos = allInserts
      this.errors = []
    },
    insertData () {
      if (this.productos.length < 1) {
        this.$q.notify({ type: 'negative', message: 'Carga un archivo válido antes' })
        return
      }
      this.isSending = true
      this.$q.electron.ipcRenderer.send('call-insert-products', this.productos, true)
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
