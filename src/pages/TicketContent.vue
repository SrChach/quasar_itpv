<template>
<center>
  <q-page padding class="q-pa-md q-gutter-sm">
    <h4>Edicion del encabezado del ticket</h4>

    <label for="tam">Selecciona el tamañano del papel de tu impresora: </label>
    <select id="tam" v-model="seleccionado" @change="formHasErrors">
      <option v-for='(opcion, index) of opciones' :value="index" :key="index" selected>
        {{opcion.size}}
      </option>
    </select>

    <p>Escribe el texto para personalizar tu ticket</p>
    <p style="color: red">
      El máximo de caracteres por linea para tu impresora es: <b>{{ opciones[seleccionado].tam }} caracteres</b>
    </p>
    <form @submit.prevent="insertarTicket" class="q-pa-md q-gutter-sm">
      <q-btn color="primary" label="Añadir linea" icon-right="add_circle" @click="lines.push('')"/>
      <q-btn type="submit" color="green" icon-right="save" label="Guardar Ticket"/>
      <div v-for="(line, index) of lines" :key="index">
        <q-input
          :label="`Linea ${index + 1}`"
          :ref="`ticket-input-${ index }`"
          v-model="lines[index]"
          clearable filled style="display: inline-block" size="45px"
          :maxlength="opciones[seleccionado].tam"
          :rules="[
            val => !!val || 'Por favor no añadas lineas en blanco',
            val => val.length <= opciones[seleccionado].tam || `Usa máximo ${ opciones[seleccionado].tam } caracteres`,
            val => /^[a-z0-9@ ñ:.,()+-]+$/i.test(val) || `Solo se permiten caracteres alfanuméricos y los siguientes: :.,()+-`
          ]"
        />
        <q-btn round color="red" size="sm" icon="remove" @click="lines.splice(index, 1)"/>
      </div>
    </form>
  </q-page>
</center>
</template>

<script>
import ticketOptions from '../assets/xmltickets/main.js'

export default {
  name: 'TicketContent',
  data: function () {
    return {
      seleccionado: 0,
      lines: [''],
      opciones: ticketOptions
    }
  },

  created () {
    this.$q.electron.ipcRenderer.on('responder-insertar-ticket', this.informResult)
  },
  destroyed () {
    this.$q.electron.ipcRenderer.removeListener('responder-insertar-ticket', this.informResult)
  },

  methods: {
    formHasErrors () {
      let hasError = false

      for (let i = 0; i < this.lines.length; i++) {
        this.$refs[`ticket-input-${i}`][0].validate()
        if (this.$refs[`ticket-input-${i}`][0].hasError) {
          hasError = true
        }
      }
      return hasError
    },
    getLinesBase16 () {
      const size = this.opciones[this.seleccionado].tam
      return this.lines
        .map(el => {
          const filled = `<line><text align="center" length="${size}">${el}</text></line>`
          let hex = ''
          for (let n = 0; n < filled.length; n++) {
            hex += Number(filled.charCodeAt(n)).toString(16)
          }
          hex += '0D0A'
          return hex
        })
        .join('')
    },
    insertarTicket () {
      if (this.formHasErrors()) {
        this.$q.notify({
          color: 'red-4',
          textColor: 'white',
          icon: 'cancel',
          message: 'El formulario tiene errores'
        })
        return 0
      }
      const hexa = this.getLinesBase16()

      const ticketData = this.opciones[this.seleccionado].xmlTicket1 + hexa + this.opciones[this.seleccionado].xmlTicket2
      const previewData = this.opciones[this.seleccionado].xmlPreview1 + hexa + this.opciones[this.seleccionado].xmlPreview2

      this.$q.electron.ipcRenderer.send('llamar-insertar-ticket', ticketData, 1)
      this.$q.electron.ipcRenderer.send('llamar-insertar-ticket', previewData, 3)
    },
    informResult (e, res, resourceId) {
      let type = 'ticket'
      if (res.affectedRows > 0) {
        if (resourceId === 3) type = 'ticket preview'

        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'done',
          message: `El ${type} ha sido modificado`
        })
      } else {
        this.$q.notify({
          color: 'red',
          textColor: 'white',
          icon: 'warning',
          message: 'Ha ocurrido un error'
        })
      }
    }
  }
}
</script>
