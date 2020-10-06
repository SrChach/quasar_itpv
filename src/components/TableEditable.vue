<template>
  <div class="q-pa-md">
    <div class="row justify-center">
      <div class="col-10 q-mb-md">
        <h4 class="text-primary q-mb-sm"><q-icon name="fact_check"/> Edición Rápida de Productos</h4>
      </div>
      <div class="col-10">
        <q-input
          v-model="search"
          label="Busca por nombre, categoría, código o referencia"
          type="text" outlined rounded dense clearable color="secondary" class="q-mb-sm"
          @keyup.enter="searchFromZero()"
        >
          <template v-slot:after>
            <q-btn round dense flat icon="search" @click="searchFromZero()"/>
          </template>
        </q-input>
      </div>
    </div>
    <q-scroll-area
      horizontal
      style="height: 50vh; width: 90vw;"
      class="row justify-center bg-grey-1 rounded-borders"
    >
      <q-markup-table class="col-11" style="margin: 0 5px;">
        <thead>
          <tr>
            <th v-for="(header, index) in showingColumns" v-show="!header.hidden" :key="index" class="text-left">
              {{ (header.header) ? header.header : header.name }}
            </th>
            <th class="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowId) in rendering" :key="rowId">
            <td v-for="(cell, cellId) in row" v-show="!cell.hidden" :key="cellId" class="text-right">
              <span v-if="typeof cell.edit === 'undefined'">
                {{ cell.original }}
              </span>

              <div v-else>
                <div v-if="cell.edit === null">
                  <q-input
                    :value="cell.original"
                    :label="cell.name"
                    readonly
                    type="text"
                    style="min-width: 120px"
                    dense
                    outlined
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
                  autogrow
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
      <q-page-sticky position="bottom-right" :offset="[40, 40]">
        <q-btn dense icon="save" label="Guardar" color="amber" @click="saveAllChanges()" class="q-mb-sm"/><br>
        <q-btn dense icon="refresh" label="Refrescar" @click="refreshPage" color="secondary" />
      </q-page-sticky>
    </q-scroll-area>
    <div class="q-pa-lg flex flex-center">
      <q-pagination
        v-if="totalPages > 0"
        v-model="currentPage"
        :max="totalPages"
        :max-pages="6"
        :boundary-numbers="true"
        :direction-links="true"
        :boundary-links="true"
        icon-first="skip_previous"
        icon-last="skip_next"
        icon-prev="fast_rewind"
        icon-next="fast_forward"
      >
      </q-pagination>
      <q-select
        label="Registros por página"
        filled
        @input="changeItemsPerPage()"
        v-model="newItemsPerPage"
        :options="[3, 5, 10, 15, 20, 25, 50, 100]"
      />
    </div>
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
      search: '',
      itemsPerPage: 20,
      totalPages: 0,
      currentPage: 1,
      lastOffset: 0,
      newItemsPerPage: 20
    }
  },

  created () {
    /** Listeners */
    this.$q.electron.ipcRenderer.on('response-get-products', this.list_products)
    this.$q.electron.ipcRenderer.on('response-get-products-paginator', this.setTotalPages)
    this.$q.electron.ipcRenderer.on('response-update-product', this.onUpdatedProduct)
    this.$q.electron.ipcRenderer.on('response-update-stock', this.onUpdatedStockCurrent)
    this.$q.electron.ipcRenderer.on('response-update-stocklevel', this.onUpdatedStockLevel)

    /** Initialize page */
    this.$q.electron.ipcRenderer.send('call-get-products', undefined, this.currentPage - 1, this.itemsPerPage)
    this.$q.electron.ipcRenderer.send('call-get-products-paginator', this.itemsPerPage)
  },

  beforeDestroy () {
    this.$q.electron.ipcRenderer.removeListener('response-get-products', this.list_products)
    this.$q.electron.ipcRenderer.removeListener('response-get-products-paginator', this.setTotalPages)
    this.$q.electron.ipcRenderer.removeListener('response-update-product', this.onUpdatedProduct)
    this.$q.electron.ipcRenderer.removeListener('response-update-stock', this.onUpdatedStockCurrent)
    this.$q.electron.ipcRenderer.removeListener('response-update-stocklevel', this.onUpdatedStockLevel)
  },

  methods: {
    setTotalPages (e, res) {
      if (res.data !== null) {
        this.totalPages = res.totalPages
      } else {
        this.$q.notify({ type: 'negative', message: res.error })
      }
    },

    changeItemsPerPage () {
      const currentPage = this.currentPage - 1
      const lastOffset = currentPage * this.itemsPerPage
      this.itemsPerPage = this.newItemsPerPage
      this.$q.electron.ipcRenderer.send('call-get-products-paginator', this.itemsPerPage, this.search)
      const newPage = Math.floor(lastOffset / this.newItemsPerPage) + 1
      if (newPage === this.currentPage) {
        this.$q.electron.ipcRenderer.send('call-get-products', this.search, currentPage * this.itemsPerPage, this.newItemsPerPage)
        return
      }
      this.currentPage = newPage
    },

    searchFromZero () {
      this.currentPage = 1
      this.$q.electron.ipcRenderer.send('call-get-products', this.search, this.currentPage - 1, this.itemsPerPage)
      this.$q.electron.ipcRenderer.send('call-get-products-paginator', this.itemsPerPage, this.search)
    },

    cleanData (data, columns) {
      const cleanedData = data.map(el => {
        const selected = []
        columns.forEach(field => {
          const inside = {
            name: field.name,
            original: el[field.name]
          }
          if (field.header) inside.header = field.header
          if (field.editable) inside.edit = null
          if (field._id) inside._id = true
          if (field.table) inside.table = field.table
          if (field.type) inside.type = field.type
          if (field.hidden) inside.hidden = field.hidden
          /** Condicion rara */
          if (field.accepted !== undefined) {
            const displaying = field.accepted[inside.original]
            if (displaying !== undefined) {
              inside.original = displaying
            }
          }
          selected.push(inside)
        })
        return selected
      })

      return cleanedData
    },

    list_products (event, res) {
      if (res.data !== null) {
        this.rendering = this.cleanData(res.data, this.showingColumns)
      } else {
        this.$q.notify({ type: 'negative', message: res.error })
      }
    },

    restoreRow (rowId, table = '') {
      const row = this.rendering[rowId]
      row.forEach(el => {
        if (typeof el.edit !== 'undefined') {
          if (table === '' || (table !== '' && el.table === table)) el.edit = null
        }
      })
    },

    refreshPage () {
      const modifiedRowIndexes = this.getModifiedRowIndexes()
      if (modifiedRowIndexes.length > 0) {
        this.$q.notify({
          message: 'Tienes cambios sin guardar',
          type: 'warning',
          actions: [
            { label: 'Quedarse', color: 'black' },
            {
              label: 'Refrescar sin guardar',
              color: 'negative',
              handler: () => {
                this.$q.electron.ipcRenderer.send('call-get-products', this.search, (this.currentPage - 1) * this.itemsPerPage, this.itemsPerPage)
              }
            }
          ]
        })
      } else {
        this.$q.electron.ipcRenderer.send('call-get-products', this.search, (this.currentPage - 1) * this.itemsPerPage, this.itemsPerPage)
      }
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

    getModifiedRowIndexes () {
      return this.rendering.reduce((acum, valorActual, index) => {
        const isModified = valorActual.some(obj => obj.edit !== null && obj.edit !== undefined)
        if (isModified) acum.push(index)
        return acum
      }, [])
    },

    saveAllChanges () {
      const modifiedRowIndexes = this.getModifiedRowIndexes()
      if (modifiedRowIndexes.length < 1) {
        this.$q.notify({ type: 'warning', message: 'No tienes cambios para guardar' })
        return
      }

      modifiedRowIndexes.forEach(rowId => {
        this.saveToDB(rowId, true)
      })
      this.$q.notify({
        color: 'primary',
        textColor: 'white',
        icon: 'check_circle',
        message: 'Sus productos han sido actualizados. Cualquier error le será notificado'
      })
    },

    createPayload (rowId, table = '') {
      const res = {}
      this.rendering[rowId].map(field => {
        if (typeof field.edit !== 'undefined' && (table === '' || field.table === table)) {
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
      const idField = this.rendering[rowId].find(
        field => field._id === true &&
        (table === '' || field.table === table)
      )
      return (idField) ? { name: idField.name, value: idField.original, tableId: rowId } : undefined
    },

    saveToDB (rowId, hideSuccess = false) {
      const res = this.createPayload(rowId, 'products')
      const idObject = this.findDataId(rowId, 'products')
      const { UNITS } = this.createPayload(rowId, 'stockcurrent')
      const { STOCKSECURITY, STOCKMAXIMUM } = this.createPayload(rowId, 'stocklevel')

      if (UNITS !== null) this.$q.electron.ipcRenderer.send('call-update-stock', idObject, UNITS)
      if (STOCKSECURITY !== null || STOCKMAXIMUM !== null) {
        this.$q.electron.ipcRenderer.send('call-update-stocklevel', idObject, STOCKSECURITY, STOCKMAXIMUM)
      }

      this.$q.electron.ipcRenderer.send('call-update-product', res, idObject, hideSuccess)
      this.blocked.push(rowId)
    },

    onUpdatedProduct (event, res) {
      if (res.affected !== undefined && res.affected > 0) {
        this.saveChangesLocally(res.idObject.tableId, 'products')
        if (!res.hideSuccess) {
          this.successMessage('Producto actualizado')
        }
      } else {
        this.restoreRow(res.idObject.tableId, 'products')
        this.errorMessage(`No se ha podido actualizar. Codigo de error: ${res.error}`)
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

    errorMessage (msg, icon = 'warning') {
      this.$q.notify({
        color: 'red-4',
        textColor: 'white',
        icon: icon,
        message: msg
      })
    },

    successMessage (msg, icon = 'check_circle') {
      this.$q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: icon,
        message: msg
      })
    }
  },

  watch: {
    currentPage: function (newPage) {
      const actualPage = newPage - 1
      const start = actualPage * this.itemsPerPage
      const increment = this.itemsPerPage
      this.$q.electron.ipcRenderer.send('call-get-products', this.search, start, increment)
    }
  }
}
</script>
