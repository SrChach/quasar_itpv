<template>
<!-- Formulario de Contraseña-->
  <q-page padding>
    <div class="q-pa-md q-gutter-sm">
          <q-card class="my-card text-white" style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)">
            <q-card-section>
                <div class="text-h6">TEST1</div>
              <div class="text-subtitle2">
                <q-btn color="white" text-color="black" label="Ejecutar" @click="runQuery('queryID')"></q-btn> |
                <q-btn color="secondary" text-color="black" label="Mas Informacion"></q-btn>
              </div>
            </q-card-section>
          </q-card>
          <q-card
            class="my-card text-white"
            style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
          >
            <q-card-section>ai
              <div class="text-h6"> Reiniciar Base de Datos</div>
              <div class="text-subtitle2">
                <q-btn color="white" text-color="black" label="Ejecutar" @click="runQuery('queryID2')"></q-btn> |
                <q-btn color="secondary" text-color="black" label="Mas Informacion"></q-btn>
              </div>
            </q-card-section>
          </q-card>
            <q-card
            class="my-card text-white"
            style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
          >
            <q-card-section>
              <div class="text-h6"> Desactivar Base de Datos</div>
              <div class="text-subtitle2">
                <q-btn color="white" text-color="black" label="Ejecutar"></q-btn> |
                <q-btn color="secondary" text-color="black" label="Mas Informacion"></q-btn>
              </div>
            </q-card-section>
          </q-card>
          <q-card
            class="my-card text-white"
            style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
          >
            <q-card-section>
              <div class="text-h6"> Desactivar Todo alv</div>
              <div class="text-subtitle2">
                <q-btn color="white" text-color="black" label="Ejecutar"></q-btn> |
                <q-btn color="secondary" text-color="black" label="Mas Informacion"></q-btn>
              </div>
            </q-card-section>
          </q-card>
          <q-card
            class="my-card text-white"
            style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
          >
            <q-card-section>
              <div class="text-h6"> Arreglar lo que cagaste :V</div>
              <div class="text-subtitle2">
                <q-btn color="white" text-color="black" label="Ejecutar"></q-btn> |
                <q-btn color="secondary" text-color="black" label="Mas Informacion"></q-btn>
              </div>
            </q-card-section>
          </q-card>
    </div>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      password: 'el_nashito'
    }
  },
  created () {
    this.$q.electron.ipcRenderer.on('emergency_Scripts', this.respManager)
  },
  beforeDestroy () {
    this.$q.electron.ipcRenderer.removeListener('emergency_Scripts', this.respManager)
  },
  methods: {
    respManager (event, data) {
      console.log(data)
    },
    runQuery (queryID) {
      this.$q.electron.ipcRenderer.send('emergencyscripts_Trigger', queryID)
    }
  }
}
</script>
