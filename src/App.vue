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
    /**
        /[a-z]{4}-[a-z]{4}-[a-z]{4}/i.test('kjas-kjas-sakj')
        Hacer algo que vaya a la API por códigos
        Checar al arrancar
        Validar que la base de datos se rife xD
     */
    const serial = 'jszs-updc-istw'
    fetch('http://smgpuntosdeventa.net/itpv_validate/?code=' + serial)
      .then(res => res.json())
      .then(res => {
        if (res.error != null) {
          this.$q.notify({ type: 'negative', message: `Ha ocurrido un error: ${res.error}` })
        } else {
          this.$q.notify({ type: 'positive', message: `Code: ${res.data.code}; Message: ${res.data.message}` })
        }
      })

    const shaCode = localStorage.getItem('sha-code')
    this.$store.commit('security/setIsAuthenticated', shaCode)
    this.$router.push('/')
  }
}
</script>
