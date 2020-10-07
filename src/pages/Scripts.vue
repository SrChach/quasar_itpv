<template>
  <q-page padding>
    <q-banner inline-actions rounded class="bg-red text-white text-center">
      <b class="text-h5">Estos comandos son para uso de usuarios avanzados, por favor antes de ejecutar cualquiera de los siguientes comandos contacte a soporte de SMG Puntos de Venta</b>
    </q-banner>
    <br><br>
    <div class="row q-gutter-md justify-center" v-if="pass != 'smgpdv20'">
      <div class="col-5 bg-yellow-4">
        <p class="text-h6 text-center">Escribe la contraseña de acceso a las herramientas de emergencia</p>
        <br>
        <q-input label="contraseña" v-model="pass"/>
      </div>
    </div>
    <div class="row q-gutter-md justify-center" v-else>
      <div class="col-5 q-gutter-md">
          <q-card class="my-card">
            <q-card-section class="bg-light-blue-8 text-white">
              <div class="text-h6">Resetear usuario Administrador</div>
              <div class="text-subtitle2">Regresa a la configuracion inicial del usuario administrador </div>
              <div class="text-subtitle2">Usar si se olvido la contraseña del usuario administrador </div>
            </q-card-section>

            <q-card-actions vertical align="center">
              <q-btn color="amber-6"  label="Ejecutar" @click="resetAdmin()" />
            </q-card-actions>
          </q-card>
           <q-separator />
          <q-card class="my-card">
            <q-card-section class="bg-light-blue-8 text-white">
              <div class="text-h6">Agregar usuario Administrador </div>
              <div class="text-subtitle2">Crea un usuario con permisos de administrador</div>
              <div class="text-subtitle2">Usar si se borro al usuario administrador</div>
            </q-card-section>

            <q-card-actions vertical align="center">
              <q-btn color="amber-6"  label="Ejecutar" @click="agregarAdmin()"/>
            </q-card-actions>
          </q-card>
           <q-separator />
          <q-card class="my-card">
            <q-card-section class="bg-light-blue-8 text-white">
              <div class="text-h6">Borrar imagenes de productos</div>
              <div class="text-subtitle2">Borra todas las imagens que tengan los productos</div>
              <div class="text-subtitle2">Usar si la seccion productos se queda cargando</div>
            </q-card-section>

            <q-card-actions vertical align="center">
              <q-btn color="amber-6"  label="Ejecutar" @click="borrarImg()"/>
            </q-card-actions>
          </q-card>
      </div>
      <div class="col-5 q-gutter-md">
          <q-card class="my-card">
            <q-card-section class="bg-light-blue-8 text-white">
              <div class="text-h6">Borrar Stock de productos</div>
              <div class="text-subtitle2">Deja en 0 las unidades de todos los productos en el almacen general</div>
              <div class="text-subtitle2">Usar si desea hacer su inventario desde 0</div>
            </q-card-section>

            <q-card-actions vertical align="center">
              <q-btn color="amber-6"  label="Ejecutar" @click="resetStock()"/>
            </q-card-actions>
          </q-card>
          <q-separator />
          <q-card class="my-card">
            <q-card-section class="bg-light-blue-8 text-white">
              <div class="text-h6">Borrar Ventas</div>
              <div class="text-subtitle2">Borra todas los tickets de venta registrados y empieza de 0</div>
              <div class="text-subtitle2">Usar si se desea empezar de 0 el historial de ventas</div>
            </q-card-section>

            <q-card-actions vertical align="center">
              <q-btn color="amber-6"  label="Ejecutar" @click="borrarVentas()"/>
            </q-card-actions>
          </q-card>
           <q-separator />
          <q-card class="my-card">
            <q-card-section class="col-5 flex-center bg-light-blue-8 text-white">
              <div class="col-5 text-h6">Borrar recurso Windows.Logo</div>
              <div class="col-5 text-subtitle2">Elimina la imagen superior del punto de venta</div>
              <div class="col-5 text-subtitle2">Usar si se modifico el recurso windows.Logo y este tapa la pantalla</div>
            </q-card-section>

            <q-card-actions vertical align="center">
              <q-btn color="amber-6"  label="Ejecutar" @click="borrarLogo()"/>
            </q-card-actions>
          </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  created () {
    this.$q.electron.ipcRenderer.on('responder-scripts', this.informResult)
  },
  destroyed () {
    this.$q.electron.ipcRenderer.removeListener('responder-scripts', this.informResult)
  },
  data: function () {
    return {
      sql: '',
      pass: ''
    }
  },
  methods: {
    informResult (e, res) {
      if (res.affectedRows > 0) {
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'done',
          message: 'Script ejecutado con Exito!'
        })
      } else {
        this.$q.notify({
          color: 'red',
          textColor: 'white',
          icon: 'warning',
          message: 'Ha ocurrido un error'
        })
        console.log(res)
      }
    },
    resetAdmin () {
      this.sql = `
      UPDATE people SET APPPASSWORD = null, VISIBLE='1', ROLE='0' WHERE ID='0'
      `
      this.$q.electron.ipcRenderer.send('llamar-scripts', this.sql)
    },
    resetStock () {
      this.sql = 'DELETE from stockcurrent'
      this.$q.electron.ipcRenderer.send('llamar-scripts', this.sql)
    },
    agregarAdmin () {
      this.sql = `
      INSERT INTO PEOPLE(ID, NAME, APPPASSWORD, ROLE, VISIBLE, IMAGE) VALUES ('0', 'Administrator', NULL, '0', TRUE, NULL);
      `
      this.$q.electron.ipcRenderer.send('llamar-scripts', this.sql)
    },
    borrarImg () {
      this.sql = `
      UPDATE products SET IMAGE=null;
      `
      this.$q.electron.ipcRenderer.send('llamar-scripts', this.sql)
    },
    borrarLogo () {
      this.sql = `
      UPDATE resources SET CONTENT=null WHERE (NAME='Window.Logo')
      `
      this.$q.electron.ipcRenderer.send('llamar-scripts', this.sql)
    },
    borrarVentas () {
      this.sql = 'DELETE from stockcurrent'
      this.$q.electron.ipcRenderer.send('llamar-scriptsVentas', this.sql)
      this.sql = 'DELETE from ticketlines'
      this.$q.electron.ipcRenderer.send('llamar-scriptsVentas', this.sql)
      this.sql = 'DELETE from taxlines'
      this.$q.electron.ipcRenderer.send('llamar-scriptsVentas', this.sql)
      this.sql = 'DELETE FROM tickets'
      this.$q.electron.ipcRenderer.send('llamar-scripts', this.sql)
      this.sql = 'UPDATE ticketsnum SET ID= 2'
      this.$q.electron.ipcRenderer.send('llamar-scriptsVentas', this.sql)
      this.sql = 'DELETE FROM payments'
      this.$q.electron.ipcRenderer.send('llamar-scriptsVentas', this.sql)
      this.sql = 'DELETE FROM receipts'
      this.$q.electron.ipcRenderer.send('llamar-scriptsVentas', this.sql)
      this.sql = 'DELETE FROM closedcash'
      this.$q.electron.ipcRenderer.send('llamar-scriptsVentas', this.sql)
      this.sql = 'DELETE FROM stockdiary'
      this.$q.electron.ipcRenderer.send('llamar-scriptsVentas', this.sql)
    }
  }
}
</script>
