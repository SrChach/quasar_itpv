<template>
  <div class="row justify-center items-center">
    <div class="col-12 col-sm-12 q-pa-md q-gutter-sm text-center">
      <q-banner rounded class="bg-info text-white">
        <p>De click en el siguiente botón para generar  una plantilla de los productos que no pudieron cargarse</p>
        <p><b>Corrija los errores para cargar estos datos nuevamente.</b></p>
        <hr>
        <q-btn color="warning" label="Generar plantilla con datos a corregir" icon="save" @click="saveErrorsFile()"/>
      </q-banner>
    </div>
    <div class="col-12 col-sm-12 q-pa-md q-gutter-sm">
      <q-expansion-item
        expand-separator
        icon="error"
        label="Hubo errores al insertar (Click para ver)"
        header-class="bg-red text-white"
        v-if="errors.length > 0"
      >
        <q-list bordered separator>
          <q-item v-ripple v-for="(error, i) in errors" :key="i">
            <q-item-section>
              <q-item-label overline><span class="text-h6">Error en la fila {{ error.arrayId + 2 }}: </span></q-item-label>
              <q-item-label>{{ error.error }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-expansion-item>
    </div>
    <div class="col-12 col-sm-10 q-pa-md q-gutter-sm">
      <div class="q-pa-md">
        <q-table
          style="margin: 0 10px"
          v-if="tableHeader.length > 0"
          title="Datos que no se insertaron"
          class="bg-red-5 text-white"
          table-class="bg-white text-black"
          :data="original"
          :columns="tableHeader"
          row-key="name"
        />
      </div>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="arrow_back" color="warning" label="Volver" @click="$emit('close')"/>
      </q-page-sticky>
    </div>
  </div>
</template>

<script>
/** Utils */
import { toOriginalFormat, saveExcel } from '../utils/process-array-excel.js'

export default {
  props: {
    errors: { type: Array, default: () => [] },
    config: { type: Array, default: () => [] },
    rows: { type: Array, default: () => [] },
    saveTo: { type: String, default: 'template.xlsx' },
    sheetTitle: { type: String, default: 'Test' }
  },
  data: () => ({
    original: [],
    tableHeader: []
  }),
  created () {
    const failed = this.errors.map(err => this.rows[err.arrayId])
    this.original = toOriginalFormat(failed, this.config)

    if (this.original.length > 0) {
      for (const field in this.original[0]) {
        this.tableHeader.push({ name: field, label: field, field: field })
      }
    }
  },
  methods: {
    saveErrorsFile () {
      const createdStatus = saveExcel(this.original, this.saveTo, this.sheetTitle)
      const typeAlert = (createdStatus.error === undefined) ? 'positive' : 'negative'

      this.$q.notify({ type: typeAlert, message: createdStatus.message })
    }
  }
}
</script>
