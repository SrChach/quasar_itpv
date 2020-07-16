<template>
  <q-page class="flex flex-center justify-center">
    <div class="q-pa-md" v-if="$q.platform.is.electron">
      <h2>ITPV - Login</h2>
      <span><b>Nota:</b> Solo para uso del administrador</span>
      <q-form
        @submit="check_credentials"
        @reset="onReset"
        class="q-gutter-md"
      >
        <q-input
          filled
          type="password"
          v-model="password"
          label="Contraseña *"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Escribe una contraseña' ]"
        />

        <div>
          <q-btn label="Submit" type="submit" color="primary"/>
          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      password: null
    }
  },
  methods: {
    check_credentials () {
      this.$q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: `Contraseña: "${this.password}"`
      })
    },

    onReset () {
      this.password = null
    }
  }
}
</script>
