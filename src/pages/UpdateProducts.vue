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
        { name: 'REFERENCE', header: 'REFERENCIA', editable: true, table: 'products' },
        { name: 'CODE', header: 'CODIGO', editable: true, table: 'products' },
        { name: 'NAME', header: 'NOMBRE', editable: true, table: 'products' },
        { name: 'CATEGORIA', editable: false },
        { name: 'PRICEBUY', header: 'PRECIO COMPRA', editable: true, table: 'products', type: 'number' },
        { name: 'PRICESELL', header: 'PRECIO VENTA', editable: true, table: 'products', type: 'number' },
        { name: 'TAXCAT', header: 'IMPUESTO', editable: false, table: 'products', accepted: { '000': 'Excento de impuesto', '001': 'IVA' } },
        { name: 'PRICESELL2', header: 'PRECIO VENTA 2', editable: true, table: 'products', type: 'number' },
        { name: 'PRICESELL3', header: 'PRECIO VENTA 3', editable: true, table: 'products', type: 'number' },
        { name: 'PRICESELL4', header: 'PRECIO VENTA 4', editable: true, table: 'products', type: 'number' },
        { name: 'PRICESELL5', header: 'PRECIO VENTA 5', editable: true, table: 'products', type: 'number' },
        { name: 'PRICESELL6', header: 'PRECIO VENTA 6', editable: true, table: 'products', type: 'number' },
        { name: 'PRICESELL7', header: 'PRECIO VENTA 7', editable: true, table: 'products', type: 'number' },
        { name: 'MARCA', editable: true, table: 'products' },
        { name: 'MODELO', editable: true, table: 'products' },
        { name: 'MONEDERO', editable: true, table: 'products', type: 'number' },
        { name: 'DISCOUNT', header: 'DESCUENTO', editable: true, table: 'products', type: 'number' },
        { name: 'SERIE', editable: true, table: 'products' },
        { name: 'MEDIDA', editable: true, table: 'products' },
        { name: 'UNITS', header: 'CANTIDAD', editable: true, table: 'stockcurrent', type: 'number' },
        { name: 'STOCKSECURITY', header: 'STOCK MINIMO', editable: true, table: 'stocklevel', type: 'number' },
        { name: 'STOCKMAXIMUM', header: 'STOCK MAXIMO', editable: true, table: 'stocklevel', type: 'number' }
      ]
    }
  },
  components: {
    'custom-table': table
  }
}
</script>
