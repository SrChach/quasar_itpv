<template>
  <q-page class="flex flex-center justify-center">
    <div class="q-pa-md">
      <custom-table @save-table="imprime" :datatable="data" :showingColumns="showingColumns"/>
    </div>
  </q-page>
</template>

<script>
import table from '../components/TableEditable'

export default {
  data () {
    return {
      data: [
        {
          ID: '11600',
          REFERENCE: 'DESCUENTO',
          CODE: '11600',
          CODETYPE: null,
          NAME: 'DESCUENTO NO BORRAR',
          PRICEBUY: 0,
          PRICESELL: 0,
          CATEGORY: '2100'
        },
        {
          ID: '11601',
          REFERENCE: 'MANO DE OBRA',
          CODE: '11601',
          CODETYPE: null,
          NAME: 'MANO DE OBRA NO BORRAR',
          PRICEBUY: 0,
          PRICESELL: 0,
          CATEGORY: '2100'
        }
      ],
      showingColumns: [ // Add types
        { name: 'ID', editable: false },
        { name: 'REFERENCE', editable: true },
        { name: 'PRICEBUY', editable: true },
        { name: 'PRICESELL', editable: true },
        { name: 'CATEGORY', editable: true },
        { name: 'NAME', editable: true }
      ]
    }
  },
  components: {
    'custom-table': table
  },
  methods: {
    imprime (e) {
      console.log(e)
    }
  }
}
</script>
