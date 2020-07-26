<template>
  <q-page class="flex flex-center justify-center">
    <div class="q-pa-md">
      <custom-table @save-table="imprime"/>
    </div>
  </q-page>
</template>

<script>
import table from '../components/TableEditable'

export default {
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
