<template>
  <q-page class="flex flex-center">
    <div class="row justify-center">
      <div class="col-12">
        <q-file
          style="max-width: 300px"
          v-model="model"
          filled
          rounded
          label="Carga tu excel aqui"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .xlsx, .xls"
          @rejected="onRejected"
          @input="readExcel"
        >
          <template v-if="model" v-slot:append>
            <q-icon name="cancel" @click.stop.prevent="cleanFile" class="cursor-pointer" />
          </template>
        </q-file>
      </div>
      <div class="col-12">
        <q-btn color="primary" label="Cargar datos" icon-right="add_circle" @click="insertData()"/>
        <pre>{{ (parsedData !== null) ? parsedData : 'No has seleccionado nada' }}</pre>
      </div>
    </div>
  </q-page>
</template>

<script>
var XLSX = require('xlsx')

export default {
  name: 'PageIndex',
  data: function () {
    return {
      model: null,
      parsedData: null
    }
  },
  created () {
    this.$q.electron.ipcRenderer.on('responder-insertar-template', this.informResult)
  },
  destroyed () {
    this.$q.electron.ipcRenderer.removeListener('responder-insertar-template', this.informResult)
  },
  methods: {
    insertData () {
      console.log('paso1')
      for (let i = 1; i < this.parsedData.length; i++) {
        // console.log(this.parsedData[i])
        this.$q.electron.ipcRenderer.send('llamar-insertar-template', this.parsedData[i], 1)
      }
    },
    onRejected (rejectedEntries) {
      // Notify plugin needs to be installed
      this.$q.notify({
        type: 'negative',
        message: `${rejectedEntries.length} archivo(s) no cumplen con los requisitos para cargarse`
      })
    },
    cleanFile () {
      this.model = null
      this.parsedData = null
    },
    readExcel (archivo) {
      if (archivo === null) return 0
      var some = this

      /** Definimos cómo se tratará el archivo cuando se lea */
      var reader = new FileReader()
      reader.onload = function (e) {
        var data = e.target.result
        data = new Uint8Array(data)
        var workbook = XLSX.read(data, {
          type: 'array'
        })

        /* DO SOMETHING WITH workbook HERE */
        var firstSheetName = workbook.SheetNames[0]
        /* Get worksheet */
        var worksheet = workbook.Sheets[firstSheetName]
        // It will prints with header and contents ex) Name, Home...
        var json = XLSX.utils.sheet_to_json(worksheet, {
          header: 1
        })
        some.parsedData = json
      }

      /** Leemos el archivo (Manda a llamar a la función) */
      reader.readAsArrayBuffer(archivo)
    },
    informResult (e, res) {
      console.log(res)
    }
  }
}
</script>
