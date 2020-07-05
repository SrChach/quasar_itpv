<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-full.svg"
    >
    <q-file
      style="max-width: 300px"
      v-model="model"
      filled
      rounded
      label="Restricted to images"
      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .xlsx, .xls"
      @rejected="onRejected"
      @input="readExcel"
    >
      <template v-if="model" v-slot:append>
        <q-icon name="cancel" @click.stop.prevent="model = null" class="cursor-pointer" />
      </template>
    </q-file>
    {{ (model !== null) ? model : 'No has seleccionado na' }}
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  data: function () {
    return {
      model: null
    }
  },
  methods: {
    onRejected (rejectedEntries) {
      // Notify plugin needs to be installed
      // https://quasar.dev/quasar-plugins/notify#Installation
      this.$q.notify({
        type: 'negative',
        message: `${rejectedEntries.length} file(s) did not pass validation constraints`
      })
    },
    readExcel (archivo) {
      console.log(archivo, 'leído')
    }
  }
}
</script>
