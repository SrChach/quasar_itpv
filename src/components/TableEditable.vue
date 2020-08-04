<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <div class="col-10">
        <q-input
          v-model="search"
          label="Busca por nombre, código, marca o modelo"
          type="text" outlined rounded dense clearable color="secondary" class="q-mb-sm"
        >
          <template v-slot:after>
            <q-btn round dense flat icon="search" @click="$q.electron.ipcRenderer.send('call-get-products', search)"/>
          </template>
        </q-input>
      </div>
    </div>
    <q-scroll-area
      horizontal
      style="height: 80vh; width: 90vw;"
      class="row justify-center bg-grey-1 rounded-borders"
    >
      <q-markup-table class="table-responsive col-11" style="margin: 0 5px;">
        <thead>
          <tr>
            <th v-for="(header, index) in showingColumns" :key="index" class="text-left">{{ header.name }}</th>
            <th class="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowId) in rendering" :key="rowId">
            <td v-for="(cell, cellId) in row" :key="cellId" class="text-right">
              <span v-if="typeof cell.edit === 'undefined'">
                {{ cell.original }}
              </span>

              <div v-else>
                <div v-if="cell.edit === null">
                  {{ cell.original }}
                  <q-btn
                    round
                    color="secondary"
                    icon="edit"
                    size="xs"
                    @click="cell.edit = (cell.original != null) ? cell.original : ''"
                  />
                </div>

                <q-input
                  v-else
                  v-model="cell.edit"
                  :label="cell.name"
                  :disable="blocked.includes(rowId)"
                  :type="cell.type || 'text'"
                  style="min-width: 120px"
                  rounded
                  clearable
                  dense
                  outlined
                />
              </div>
            </td>
            <td>
              <div v-if="row.some(cell => typeof cell.edit !== 'undefined' && cell.edit !== null)">
                <q-spinner-hourglass v-if="blocked.includes(rowId)"
                  color="purple"
                />
                <div v-else>
                  <q-btn
                    @click="restoreRow(rowId)"
                    round
                    color="amber"
                    icon="undo"
                    size="sm"
                  />
                  <q-btn
                    @click="saveToDB(rowId)"
                    round
                    color="red"
                    icon="save"
                    size="sm"
                  />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-scroll-area>
  </div>
</template>

<script>
export default {
  props: {
    datatable: {
      type: Array,
      default: () => []
    },
    showingColumns: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      rendering: [],
      blocked: [],
      search: ''
    }
  },

  created () {
    this.$q.electron.ipcRenderer.send('call-get-products')
    this.$q.electron.ipcRenderer.on('response-get-products', this.list_products)
    this.$q.electron.ipcRenderer.on('response-update-product', this.onUpdatedProduct)
    this.$q.electron.ipcRenderer.on('response-update-stock', this.onUpdatedStockCurrent)
    this.$q.electron.ipcRenderer.on('response-update-stocklevel', this.onUpdatedStockLevel)
  },

  beforeDestroy () {
    this.$q.electron.ipcRenderer.removeListener('response-get-products', this.list_products)
    this.$q.electron.ipcRenderer.removeListener('response-update-product', this.onUpdatedProduct)
    this.$q.electron.ipcRenderer.removeListener('response-update-stock', this.onUpdatedStockCurrent)
    this.$q.electron.ipcRenderer.removeListener('response-update-stocklevel', this.onUpdatedStockLevel)
  },

  methods: {
    cleanData (data, columns) {
      const cleanedData = data.map(el => {
        const selected = []
        columns.forEach(field => {
          const inside = {
            name: field.name,
            original: el[field.name]
          }
          if (field.editable) inside.edit = null
          if (field._id) inside._id = true
          if (field.table) inside.table = field.table
          if (field.type) inside.type = field.type
          selected.push(inside)
        })
        return selected
      })

      return cleanedData
    },

    list_products (event, res) {
      this.rendering = this.cleanData(res, this.showingColumns)
    },

    restoreRow (rowId, table = '') {
      const row = this.rendering[rowId]
      row.forEach(el => {
        if (typeof el.edit !== 'undefined') {
          if (table === '' || (table !== '' && el.table === table)) el.edit = null
        }
      })
    },

    saveChangesLocally (rowId, table = '') {
      const row = this.rendering[rowId]
      row.forEach(el => {
        if (typeof el.edit !== 'undefined' && el.edit !== null) {
          if (table === '' || (table !== '' && el.table === table)) {
            el.original = el.edit
            el.edit = null
          }
        }
      })
    },

    createPayload (rowId, table = '') {
      let row = JSON.parse(JSON.stringify(this.rendering[rowId]))
      const res = {}
      if (table !== '') row = row.filter(field => field.table === table)
      row.map(field => {
        if (typeof field.edit !== 'undefined') {
          if (field.edit !== null) {
            res[field.name] = field.edit
          } else {
            res[field.name] = field.original
          }
        }
      })
      return res
    },

    findDataId (rowId, table = '') {
      let row = JSON.parse(JSON.stringify(this.rendering[rowId]))
      if (table !== '') row = row.filter(field => field.table === table)
      const idField = row.find(field => field._id === true)
      return (idField) ? { name: idField.name, value: idField.original, tableId: rowId } : undefined
    },

    saveToDB (rowId) {
      const res = this.createPayload(rowId, 'products')
      const idObject = this.findDataId(rowId, 'products')
      const { UNITS } = this.createPayload(rowId, 'stockcurrent')
      const { STOCKSECURITY, STOCKMAXIMUM } = this.createPayload(rowId, 'stocklevel')

      if (UNITS !== null) this.$q.electron.ipcRenderer.send('call-update-stock', idObject, UNITS)
      if (STOCKSECURITY !== null || STOCKMAXIMUM !== null) {
        this.$q.electron.ipcRenderer.send('call-update-stocklevel', idObject, STOCKSECURITY, STOCKMAXIMUM)
      }

      this.$q.electron.ipcRenderer.send('call-update-product', res, idObject)
      this.blocked.push(rowId)
    },

    onUpdatedProduct (event, res) {
      if (res.affected !== undefined && res.affected > 0) {
        this.saveChangesLocally(res.idObject.tableId, 'products')
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'check_circle',
          message: 'Producto actualizado'
        })
      } else {
        this.restoreRow(res.idObject.tableId, 'products')
        this.$q.notify({
          color: 'red-4',
          textColor: 'white',
          icon: 'warning',
          message: `No se ha podido actualizar.
          Codigo de error: ${res.error}`
        })
      }
      const index = this.blocked.indexOf(res.idObject.tableId)
      if (index > -1) this.blocked.splice(index, 1)
    },

    onUpdatedStockCurrent (event, res) {
      if (res.error) {
        this.errorMessage('Las Unidades en Stock no se actualizaron. La cantidad ingresada tiene que ser un número')
        this.restoreRow(res.tableId, 'stockcurrent')
      } else {
        this.saveChangesLocally(res.tableId, 'stockcurrent')
      }
    },

    onUpdatedStockLevel (event, res) {
      if (res.error) {
        this.errorMessage('Los límites de stock no se actualizaron. Cheque que ambos sean números')
        this.restoreRow(res.tableId, 'stocklevel')
      } else {
        this.saveChangesLocally(res.tableId, 'stocklevel')
      }
    },

    errorMessage (msg) {
      this.$q.notify({
        color: 'red-4',
        textColor: 'white',
        icon: 'warning',
        message: msg
      })
    }
  }
}
</script>
