<template>
  <q-layout view="hHh Lpr fFf">

    <!-- The Footer -->
    <q-footer>
      <q-tabs switch-indicator>
      </q-tabs>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
export default {
  name: 'Unactivated',
  data () {
    return {}
  }
}
</script>
