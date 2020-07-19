<template>
  <q-layout view="hHh Lpr fFf">

    <!-- The Header -->
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          ITPV
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- The Footer -->
    <q-footer>
      <q-tabs switch-indicator>
        <q-route-tab
          icon="login"
          to="/unauthenticated"
          replace
          label="Login"
        />
        <q-route-tab
          icon="assignment"
          to="/unauthenticated/scripts"
          replace
          label="emergencia"
        />
      </q-tabs>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
export default {
  name: 'Unauthenticated',
  data () {
    return {}
  }
}
</script>
