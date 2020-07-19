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
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
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
          title: 'Load Excel',
          caption: 'Carga datos desde un excel',
          icon: 'arrow_circle_up',
          link: '/carga'
        },
        {
          title: 'Database (Alpha)',
          caption: 'Test connection to database on frontend',
          icon: 'donut_small',
          link: '/database'
        },
        {
          title: 'Cargar tickets',
          caption: 'Load XML files',
          icon: 'code',
          link: '/tickets'
        },
        {
          title: 'Logout',
          caption: 'Exit from system',
          icon: 'cancel',
          link: '/unauthenticated'
        }
      ]
    }
  }
}
</script>
