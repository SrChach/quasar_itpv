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
                <div>
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
                  {{ blocked }}
                </div>
              </div>
              <div v-else>
                <q-spinner-hourglass v-if="blocked.includes(rowId)"
                  color="purple"
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
    this.rendering = this.cleanData(this.datatable, this.showingColumns)
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
      const res = {}
      row.map(field => {
        if (typeof field.edit !== 'undefined' && field.edit !== null) {
          res[field.name] = field.edit
        } else {
          res[field.name] = field.original
        }
      })
      this.blocked.push(rowId)
      this.saveChanges(rowId)
      this.$emit('save-table', { id: rowId, res: res })
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
