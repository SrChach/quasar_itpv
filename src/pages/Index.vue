<template>
  <q-page class="flex flex-center justify-center">
    <div class="q-pa-md">
      <q-btn color="red" icon="cancel" label="Cerrar sesión" @click="closeSession"/>
    </div>
  </q-page>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    closeSession () {
      this.$store.commit('security/logout')
      this.$router.push('/unauthenticated')
    }
  }
}
</script>
