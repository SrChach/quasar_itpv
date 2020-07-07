<template>
  <q-page class="flex flex-center justify-center">
    <h3 v-if="!$q.platform.is.electron">
      La funcionalidad de DB no funciona en navegadores, solo en escritorio
    </h3>
    <h3 v-else>Aqui irá el test de la conexión a DB</h3>
  </q-page>
</template>

<script>
export default {
  mounted () {
    if (this.$q.platform.is.electron) {
      this.$q.electron.ipcRenderer.send('some-message', {
        value: 'aslkslajsl'
      })
      // this.$q.electron.ipcRenderer.send('nunca', {
      //   value: 'aslkslajsl'
      // })
    }
  }
}
</script>
