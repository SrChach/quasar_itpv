<template>
  <div id="q-app">
    <div>
      <h2 v-if="!$q.platform.is.electron">Lo sentimos, esta aplicación está diseñada solo para Escritorio y Móvil</h2>
      <router-view v-else/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    const shaCode = localStorage.getItem('sha-code')
    this.$store.commit('security/setIsAuthenticated', shaCode)
  }
}
</script>
