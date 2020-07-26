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
            <th v-for="(header, index) in showing" :key="index" class="text-left">{{ header.name }}</th>
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
                <q-btn
                  @click="restore(rowId)"
                  round
                  color="amber"
                  icon="undo"
                  size="sm"
                />
                <q-btn
                  @click="save({ rowId, row })"
                  round
                  color="red"
                  icon="save"
                  size="sm"
                />
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
  data () {
    return {
      datatable: [
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

      showing: [ // Add types
        { name: 'ID', editable: false },
        { name: 'REFERENCE', editable: true },
        { name: 'PRICEBUY', editable: true },
        { name: 'PRICESELL', editable: true },
        { name: 'CATEGORY', editable: true },
        { name: 'NAME', editable: true }
      ],

      rendering: []
    }
  },

  created () {
    this.rendering = this.cleanData(this.datatable, this.showing)
  },

  methods: {
    restore (rowId) {
      const row = this.rendering[rowId]
      row.forEach(el => {
        if (typeof el.edit !== 'undefined') {
          el.edit = null
        }
      })
    },

    saveChanges (rowId) {
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

    save ({ rowId, row }) {
      this.saveChanges(rowId)
      const res = {}
      row.map(field => {
        if (typeof field.edit !== 'undefined' && field.edit !== null) {
          res[field.name] = field.edit
        } else {
          res[field.name] = field.original
        }
      })
      this.$emit('save-table', { id: rowId, res: res })
      console.log({
        id: rowId,
        res: res,
        row: row
      })
      this.saveChanges(rowId)
    },

    cleanData (data, columns) {
      const cleanedData = data.map(el => {
        const selected = []
        columns.forEach(field => {
          const inside = {
            name: field.name,
            original: el[field.name]
          }
          if (field.editable) {
            inside.edit = null
          }
          selected.push(inside)
        })
        return selected
      })

      return cleanedData
    }
  }
}
</script>
