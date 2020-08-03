<template>
  <q-page class="flex flex-center justify-center">
    <div class="q-pa-md">
      <custom-table :datatable="data" :showingColumns="showingColumns"/>
    </div>
  </q-page>
</template>

<script>
import table from '../components/TableEditable'

export default {
  data () {
    return {
      data: [],
      showingColumns: [ // Add types
        { name: 'ID', editable: false, _id: true, table: 'products' },
        { name: 'CODE', editable: true, table: 'products' },
        { name: 'NAME', editable: true, table: 'products' },
        { name: 'PRICEBUY', editable: true, table: 'products' },
        { name: 'PRICESELL', editable: true, table: 'products' },
        { name: 'CATEGORY', editable: false, table: 'products' },
        { name: 'TAXCAT', editable: false, table: 'products' },
        { name: 'REFERENCE', editable: true, table: 'products' },
        { name: 'MARCA', editable: true, table: 'products' },
        { name: 'MODELO', editable: true, table: 'products' },
        { name: 'MONEDERO', editable: true, table: 'products' },
        { name: 'MEDIDA', editable: false, table: 'products' },
        { name: 'UNITS', editable: true, table: 'stockcurrent' },
        { name: 'STOCKSECURITY', editable: true, table: 'stocklevel' },
        { name: 'STOCKMAXIMUM', editable: true, table: 'stocklevel' }
      ]
    }
  },
  components: {
    'custom-table': table
  }
}
</script>
