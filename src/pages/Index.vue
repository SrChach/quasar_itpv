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
        { name: 'ID', editable: false, _id: true },
        { name: 'REFERENCE', editable: true },
        { name: 'PRICEBUY', editable: true },
        { name: 'PRICESELL', editable: true },
        { name: 'CATEGORY', editable: false },
        { name: 'NAME', editable: true }
      ]
    }
  },
  components: {
    'custom-table': table
  }
}
</script>
