<template>
  <q-page padding>
    <h4>Contenido de los tickets</h4>
    <label for="tam">Selecciona el tamañano del papel de tu impresora: </label>
    <select id="tam" v-model="seleccionado">
      <option v-for='opcion of opciones' :value="opcion.id" :key="opcion.id" > {{opcion.size}}</option>
    </select>
    <p>Escribe el texto para personalizar tu ticket {{seleccionado}}</p>
    <ul>
      <li v-for="linea of lineas" :key="linea.id">
        <input type="text" v-model="linea.texto">
      </li>
    </ul>
    <button @click="agregarLinea">Agregar Linea</button> <button @click="quitarLinea">Quitar Linea</button>
  </q-page>
</template>

<script>
export default {
  name: 'TicketContent',
  data: function () {
    return {
      seleccionado: null,
      lineas: [
        {
          id: 1,
          texto: 'Linea 1'
        },
        {
          id: 2,
          texto: 'Linea 2'
        }
      ],
      opciones: [
        {
          id: 1,
          size: '58mm',
          xmlTicket: '',
          xmlPreview: ''
        },
        {
          id: 2,
          size: '80mm',
          xmlTicket: '',
          xmlPreview: ''
        }
      ],
      templates: [
        {
          name: 'Ticket ejemplo',
          max_chars: 28,
          size: '58mm',
          constraints: 'Describe las restricciones para que aparezca',
          xml: `
            <ticket>
              <image>Printer.Ticket.Logo</image>
              <line></line>
              ...
          `
        },
        {
          name: 'ejemplo2',
          max_chars: '...'
        }
      ],
      contador: 3
    }
  },
  methods: {
    agregarLinea () {
      this.lineas.push({
        id: this.contador,
        texto: 'Linea ' + this.contador
      })
      this.contador++
    },
    quitarLinea () {
      if (this.contador > 1) {
        this.lineas.pop()
        this.contador--
      }
    }
  }
}
</script>
