<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md row justify-center items-center q-gutter-md">
      <div class="col-12 items-center">
        <q-img
          src="/icons/favicon-128x128.png"
          style="width: 170px"
        /><br>
        <h4 class="text-center">
          Bienvenido<br>
          {{ clientName }}
        </h4>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      clientName: ''
    }
  },
  created () {
    const clientName = (this.$store.getters['security/getClientName'])
      ? this.$store.getters['security/getClientName']
      : ''
    this.clientName = clientName
  }
}
</script>
