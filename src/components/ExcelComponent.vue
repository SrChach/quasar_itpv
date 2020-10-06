<template>
  <div>
    <center>
    <q-file
      style="max-width: 300px"
      v-model="excelFile"
      filled
      :label="title"
      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .xlsx, .xls"
      @rejected="onRejected"
      @input="readExcel"
    >
      <template v-if="excelFile" v-slot:append>
        <q-icon name="cancel" @click.stop.prevent="cleanFile" class="cursor-pointer" />
      </template>
    </q-file>
    </center>
  </div>
</template>

<script>
/** Utils */
import { read as xlsxRead, utils as xlsxUtils } from 'xlsx'

export default {
  props: {
    title: { type: String, default: 'Carga tu excel aqui' }
  },

  data: () => ({
    excelFile: null,
    excelData: null
  }),

  methods: {
    onRejected (rejectedEntries) {
      // Notify plugin needs to be installed
      this.$q.notify({
        type: 'negative',
        message: `${rejectedEntries.length} archivo(s) no cumplen con los requisitos para cargarse`
      })
    },
    cleanFile () {
      this.excelFile = null
      this.updateExcelData(null)
      this.excelData = null
    },
    updateExcelData (data = null) {
      this.excelData = data
      this.$emit('change-excel', data)
    },
    readExcel (archivo) {
      if (archivo === null) return 0
      var thisComponent = this

      /** Definimos cómo se tratará el archivo cuando se lea */
      var reader = new FileReader()
      reader.onload = function (e) {
        var data = e.target.result
        data = new Uint8Array(data)
        var workbook = xlsxRead(data, {
          type: 'array'
        })

        /* DO SOMETHING WITH workbook HERE */
        var firstSheetName = workbook.SheetNames[0]
        /* Get worksheet */
        var worksheet = workbook.Sheets[firstSheetName]
        // It will prints with header and contents ex) Name, Home...
        var json = xlsxUtils.sheet_to_json(worksheet, {
          header: 1
        })
        thisComponent.updateExcelData(json)
      }

      /** Leemos el archivo (Manda a llamar a la función) */
      reader.readAsArrayBuffer(archivo)
    }
  }
}
</script>
