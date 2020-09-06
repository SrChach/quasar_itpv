<template>
  <q-page padding>
    <div class="q-pa-md q-gutter-sm">
          <q-card class="my-card text-white" style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)">
            <q-card-section>
                <div class="text-h6">Borrar Usuario Administrador</div>
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
              <div class="text-h6"> Reiniciar Base de Datos</div>
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
  // name: 'PageName',
  created () {
    this.$q.electron.ipcRenderer.on('responder-delete-admin', this.informResult)
    this.$q.electron.ipcRenderer.on('responder-show-ID', this.informResult)
  },
  destroyed () {
    this.$q.electron.ipcRenderer.removeListener('responder-delete-admin', this.informResult)
    this.$q.electron.ipcRenderer.removeListener('responder-show-ID', this.informResult)
  },
  methods: {
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
    },
    validateAdmin () {
      this.$q.electron.ipcRenderer.send('llamar-delete-admin')
    },
    validateID (){
      this.$q.electron.ipcRenderer.send('llamar-show-ID')
    }
  }
}
</script>
