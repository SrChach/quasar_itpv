<template>
  <q-scroll-area
    horizontal
    style="height: 80vh; width: 90vw;"
    class="bg-grey-1 rounded-borders"
  >
    <div class="row no-wrap">
      <q-markup-table class="table-responsive">
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
                    @click="cell.edit = cell.original"
                  />
                </div>

                <q-input
                  v-else
                  :disable="blocked.includes(rowId)"
                  v-model="cell.edit"
                  :label="cell.name"
                  style="min-width: 100px"
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
                    @click="saveToDB({ rowId, row })"
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
    </div>
  </q-scroll-area>
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
      blocked: []
    }
  },

  created () {
    this.$q.electron.ipcRenderer.send('call-get-products', 'some filters will be here')
    this.$q.electron.ipcRenderer.on('response-get-products', this.list_products)
    this.$q.electron.ipcRenderer.on('response-update-product', this.manageUpdated)
  },

  beforeDestroy () {
    this.$q.electron.ipcRenderer.removeListener('response-get-products', this.list_products)
    this.$q.electron.ipcRenderer.removeListener('response-update-product', this.manageUpdated)
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
          selected.push(inside)
        })
        return selected
      })

      return cleanedData
    },

    list_products (event, res) {
      this.rendering = this.cleanData(res, this.showingColumns)
    },

    restoreRow (rowId) {
      const row = this.rendering[rowId]
      row.forEach(el => {
        if (typeof el.edit !== 'undefined') {
          el.edit = null
        }
      })
    },

    saveChangesLocally (rowId) {
      const row = this.rendering[rowId]
      row.forEach(el => {
        if (typeof el.edit !== 'undefined') {
          if (el.edit !== null) {
            el.original = el.edit
            el.edit = null
          }
        }
      })
    },

    createPayload (rowId) {
      const row = this.rendering[rowId]
      const res = {}
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

    findDataId (rowId) {
      const idField = this.rendering[rowId].find(field => field._id === true)
      return (idField) ? { name: idField.name, value: idField.original, tableId: rowId } : undefined
    },

    saveToDB ({ rowId, row }) {
      const res = this.createPayload(rowId)
      const idObject = this.findDataId(rowId)
      this.$q.electron.ipcRenderer.send('call-update-product', res, idObject)
      this.blocked.push(rowId)
    },

    manageUpdated (event, res) {
      if (res.affected !== undefined && res.affected > 0) {
        this.saveChangesLocally(res.idObject.tableId)
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'check_circle',
          message: 'Producto actualizado'
        })
      } else {
        this.restoreRow(res.idObject.tableId)
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
    }
  }
}
</script>
