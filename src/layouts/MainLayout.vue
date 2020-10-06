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
          label="Cerrar Sesión"
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
        <div style="position: absolute;
          bottom: 0;
          width: 100%;
          height: auto;">
          <q-item tag="a" @click="openVideo">
            <q-item-section avatar>
              <q-icon name="play_circle_filled" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Videotutorial ITPV</q-item-label>
              <q-item-label caption>
                Tutorial guia para usar iTPV y sus complementos
              </q-item-label>
            </q-item-section>
          </q-item>
        </div>
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
    },
    openVideo () {
      this.$q.electron.ipcRenderer.send('open-url', 'https://www.youtube.com/watch?v=3wDKI4IA7H8')
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
          title: 'Editar Productos',
          caption: 'Ver y actualizar datos de los productos',
          icon: 'fact_check',
          link: '/products'
        },
        {
          title: 'Personalizar tickets',
          caption: 'Agregue los datos de su negocio en el ticket de venta',
          icon: 'code',
          link: '/tickets'
        }
      ]
    }
  }
}
</script>
