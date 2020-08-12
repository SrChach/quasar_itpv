<template>
  <div>
    <q-page class="flex flex-center" v-if="errors.length < 1">
      <div class="row justify-center items-center">
        <div class="col-10 q-mb-md">
          <h4 class="text-primary q-mb-sm"><q-icon name="person"/> CLIENTES - CARGA MASIVA</h4>
          <p>Descargue la plantilla ejemplo y llene los datos solicitados.</p>
        </div>
        <div class="col-12 col-sm-11 q-gutter-sm">
          <q-chip v-if="(clientes.length < 1)" color="red" text-color="white" icon="warning" label="Selecciona un archivo con formato válido" />
          <q-chip v-else color="green" text-color="white" icon="check_circle" label="Datos del excel cargados" />
        </div>
        <div class="col-12 col-sm-6 q-pa-md q-gutter-sm">
          <componente-de-excel v-show="!isSending" @change-excel="setProductsData"/>
          <q-spinner-hourglass size="md" v-show="isSending" color="secondary"/>
        </div>
        <div class="col-12 col-sm-6 q-pa-md q-gutter-sm">
          <q-btn v-if="!isSending" color="primary" label="Cargar datos" icon="add_circle" @click="insertData()" />
          <span v-else>Esperando a que se inserten los clientes</span>
        </div>
      </div>
    </q-page>
    <q-page v-if="errors.length > 0">
      <excel-errors
        :errors="errors"
        :config="headerConfig"
        :rows="clientes"
        :saveTo="saveTo"
        sheetTitle="Clientes"
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
      clientes: [],
      isSending: false,
      errors: [],
      saveTo: 'plantilla_clientes_itpv.xlsx',
      headerConfig: [
        { match: val => /rfc/i.test(val), databaseName: 'ID', col: 'RFC' },
        { match: val => /clave(.*)busqueda/i.test(val), databaseName: 'SEARCHKEY', col: 'CLAVE DE BUSQUEDA' },
        { match: val => /nombre(.*)cliente/i.test(val), databaseName: 'NAME', col: 'NOMBRE DEL CLIENTE' },
        { match: val => /tarjeta/i.test(val), databaseName: 'CARD', col: 'TARJETA' },
        { match: val => /deuda(.*)m[aá]xima/i.test(val), databaseName: 'MAXDEBT', changes: val => Number(val), col: 'DEUDA MAXIMA' },
        { match: val => /monedero(.*)activo/i.test(val), default: 0, databaseName: 'MONEDERO_ACTIVO', changes: val => (/(.*)si(.*)/i.test(val)) ? 1 : 0, col: 'MONEDERO ACTIVO' },
        { match: val => /calle/i.test(val), databaseName: 'ADDRESS', col: 'CALLE' },
        { match: val => /numero/i.test(val), databaseName: 'ADDRESS2', col: 'NUMERO' },
        { match: val => /codigo(.*)postal/i.test(val), databaseName: 'POSTAL', col: 'CODIGO POSTAL' },
        { match: val => /colonia/i.test(val), databaseName: 'PHONE2', col: 'COLONIA' },
        { match: val => /municipio/i.test(val), databaseName: 'CITY', col: 'MUNICIPIO' },
        { match: val => /estado/i.test(val), databaseName: 'REGION', col: 'ESTADO' },
        { match: val => /pais/i.test(val), databaseName: 'COUNTRY', col: 'PAIS' },
        { match: val => /nombre/i.test(val), databaseName: 'FIRSTNAME', col: 'NOMBRE' },
        { match: val => /apellidos/i.test(val), databaseName: 'LASTNAME', col: 'APELLIDOS' },
        { match: val => /email/i.test(val), databaseName: 'EMAIL', col: 'EMAIL' },
        { match: val => /telefono/i.test(val), databaseName: 'PHONE', col: 'TELEFONO' },
        { match: val => /notas/i.test(val), databaseName: 'NOTES', col: 'NOTAS' }
      ]
    }
  },
  created () {
    this.$q.electron.ipcRenderer.on('response-insert-customers', this.manageResponse)
    this.saveTo = this.getSaveDirectory('plantilla_clientes_itpv.xlsx')
  },
  destroyed () {
    this.$q.electron.ipcRenderer.removeListener('response-insert-customers', this.manageResponse)
  },
  methods: {
    getSaveDirectory (filename) {
      const homepath = process.env.HOMEPATH || process.env.HOME
      if (this.$q.platform.is.linux) return `${homepath}/${filename}`
      return `${homepath}/Desktop/${filename}`
    },
    setProductsData (data) {
      const allInserts = cleanExcelData(data, this.headerConfig)
      allInserts.forEach(obj => { obj.TAXID = obj.ID })
      this.clientes = allInserts
      this.errors = []
    },
    insertData () {
      if (this.clientes.length < 1) {
        this.$q.notify({ type: 'negative', message: 'Carga un archivo válido antes' })
        return
      }
      this.$q.electron.ipcRenderer.send('call-insert-customers', this.clientes, true)
      this.isSending = true
    },
    manageResponse (e, res) {
      /** For template configuration */
      this.isSending = false
      this.errors = res

      this.$q.notify({
        type: 'info',
        message: 'Clientes cargados. Cualquier error le será notificado'
      })
    },
    reset () {
      this.errors = []
      this.clientes = []
    }
  },
  components: {
    'componente-de-excel': load,
    'excel-errors': excelErrors
  }
}
</script>
