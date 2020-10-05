<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          ITPV Tools
        </q-toolbar-title>

        <q-btn
          flat
          icon-right="logout"
          label="Salir"
          aria-label="Logout"
          @click="closeSession"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Essential Links
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'

export default {
  name: 'MainLayout',
  components: {
    EssentialLink
  },
  methods: {
    closeSession () {
      this.$store.commit('security/logout')
      this.$router.push('/unauthenticated')
    }
  },

  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: [
        {
          title: 'Home',
          caption: 'application.home',
          icon: 'home',
          link: '/'
        },
        {
          title: 'Edición rápida de Productos',
          caption: 'Ver y actualizar datos de los productos',
          icon: 'fact_check',
          link: '/products'
        },
        {
          title: 'Cargar productos',
          caption: 'Carga productos desde un excel',
          icon: 'tapas',
          link: '/carga'
        },
        {
          title: 'Cargar clientes',
          caption: 'Cargar clientes desde Excel',
          icon: 'person_add',
          link: '/customers'
        },
        {
          title: 'Cargar tickets',
          caption: 'Load XML files',
          icon: 'code',
          link: '/tickets'
        }
      ]
    }
  }
}
</script>
