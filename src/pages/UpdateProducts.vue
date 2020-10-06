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
      showingColumns: [
        { name: 'ID', editable: false, _id: true, table: 'products', hidden: true },
        { name: 'REFERENCE', editable: true, table: 'products' },
        { name: 'CODE', editable: true, table: 'products' },
        { name: 'NAME', editable: true, table: 'products' },
        { name: 'CATEGORIA', editable: false },
        { name: 'PRICEBUY', editable: true, table: 'products', type: 'number' },
        { name: 'PRICESELL', editable: true, table: 'products', type: 'number' },
        { name: 'TAXCAT', editable: false, table: 'products', display: { '000': 'Excento de impuesto', '001': 'IVA' } },
        { name: 'PRICESELL2', editable: true, table: 'products', type: 'number' },
        { name: 'PRICESELL3', editable: true, table: 'products', type: 'number' },
        { name: 'PRICESELL4', editable: true, table: 'products', type: 'number' },
        { name: 'PRICESELL5', editable: true, table: 'products', type: 'number' },
        { name: 'PRICESELL6', editable: true, table: 'products', type: 'number' },
        { name: 'PRICESELL7', editable: true, table: 'products', type: 'number' },
        { name: 'MARCA', editable: true, table: 'products' },
        { name: 'MODELO', editable: true, table: 'products' },
        { name: 'MONEDERO', editable: true, table: 'products', type: 'number' },
        { name: 'DISCOUNT', editable: true, table: 'products', type: 'number' },
        { name: 'SERIE', editable: true, table: 'products' },
        { name: 'MEDIDA', editable: true, table: 'products' },
        { name: 'UNITS', editable: true, table: 'stockcurrent', type: 'number' },
        { name: 'STOCKSECURITY', editable: true, table: 'stocklevel', type: 'number' },
        { name: 'STOCKMAXIMUM', editable: true, table: 'stocklevel', type: 'number' }
      ]
    }
  },
  components: {
    'custom-table': table
  }
}
</script>
