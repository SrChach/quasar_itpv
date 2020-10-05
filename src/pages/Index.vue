<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md row justify-center items-center q-gutter-md">
      <div class="col-12">
        <h4 class="text-center">
          Bienvenido <b class="text-primary">{{ clientName }}</b>
        </h4>
      </div>
      <div class="col-4">
        <squared-route title="Cargar Productos" subhead="Carga masiva de Productos" to="carga"/>
      </div>
      <div class="col-4">
        <squared-route title="Cargar Clientes" subhead="Carga masiva de Clientes" to="customers"/>
      </div>
      <div class="col-4">
        <squared-route title="Editar Productos" subhead="Edición Rapida de Productos" to="products"/>
      </div>
      <div class="col-4">
        <squared-route title="Personalizar Ticket" subhead="Personalizar Ticket de Venta" to="tickets"/>
      </div>
    </div>
  </q-page>
</template>

<script>
import SquaredRoute from '../components/SquaredRoute.vue'

export default {
  components: {
    'squared-route': SquaredRoute
  },
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
