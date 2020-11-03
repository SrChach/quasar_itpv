<template>
  <q-page class="flex flex-center justify-center">
    <div class="q-pa-md">
      <custom-table
        ref="child"
        :datatable="data"
        :showingColumns="showingColumns"
      />
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
        { name: 'REFERENCE', header: 'REFERENCIA', editable: true, table: 'products', hiddable: true },
        { name: 'CODE', header: 'CODIGO', editable: true, table: 'products' },
        { name: 'NAME', header: 'NOMBRE', editable: true, table: 'products' },
        { name: 'CATEGORIA', editable: false, hiddable: true },
        { name: 'PRICEBUY', header: 'PRECIO COMPRA', editable: true, table: 'products', type: 'number', hiddable: true },
        { name: 'PRICESELL', header: 'PRECIO VENTA', editable: true, table: 'products', type: 'number', hiddable: true },
        { name: 'TAXCAT', header: 'IMPUESTO', editable: false, table: 'products', accepted: { '000': 'Excento de impuesto', '001': 'IVA' }, hiddable: true },
        { name: 'PRICESELL2', header: 'PRECIO VENTA 2', editable: true, table: 'products', type: 'number', hiddable: true },
        { name: 'PRICESELL3', header: 'PRECIO VENTA 3', editable: true, table: 'products', type: 'number', hiddable: true },
        { name: 'PRICESELL4', header: 'PRECIO VENTA 4', editable: true, table: 'products', type: 'number', hiddable: true },
        { name: 'PRICESELL5', header: 'PRECIO VENTA 5', editable: true, table: 'products', type: 'number', hiddable: true },
        { name: 'PRICESELL6', header: 'PRECIO VENTA 6', editable: true, table: 'products', type: 'number', hiddable: true },
        { name: 'PRICESELL7', header: 'PRECIO VENTA 7', editable: true, table: 'products', type: 'number', hiddable: true },
        { name: 'MARCA', editable: true, table: 'products', hiddable: true },
        { name: 'MODELO', editable: true, table: 'products', hiddable: true },
        { name: 'MONEDERO', editable: true, table: 'products', type: 'number', hiddable: true },
        { name: 'DISCOUNT', header: 'DESCUENTO', editable: true, table: 'products', type: 'number', hiddable: true },
        { name: 'SERIE', editable: true, table: 'products', hiddable: true },
        { name: 'MEDIDA', editable: true, table: 'products', hiddable: true },
        { name: 'UNITS', header: 'CANTIDAD', editable: true, table: 'stockcurrent', type: 'number', hiddable: true },
        { name: 'STOCKSECURITY', header: 'STOCK MINIMO', editable: true, table: 'stocklevel', type: 'number', hiddable: true },
        { name: 'STOCKMAXIMUM', header: 'STOCK MAXIMO', editable: true, table: 'stocklevel', type: 'number', hiddable: true }
      ]
    }
  },
  components: {
    'custom-table': table
  },

  beforeRouteLeave (to, from, next) {
    const modifiedRowIndexes = this.$refs.child.getModifiedRowIndexes()
    if (modifiedRowIndexes.length > 0) {
      this.$q.notify({
        message: 'Tienes cambios sin guardar',
        type: 'warning',
        actions: [
          { label: 'Quedarse', color: 'black' },
          {
            label: 'Salir sin guardar',
            color: 'negative',
            handler: () => { next() }
          }
        ]
      })
    } else {
      next()
    }
  }
}
</script>
