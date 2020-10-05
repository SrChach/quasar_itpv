<template>
    <router-link :to="to">
      <q-card class="my-card">
        <q-item>
          <q-item-section>
            <q-item-label style="text-primary">{{ title }}</q-item-label>
            <q-item-label caption>{{ subhead }}</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-avatar>
              <q-icon name="near_me" />
            </q-avatar>
          </q-item-section>
        </q-item>
      </q-card>
    </router-link>
</template>

<script>
export default {
  props: {
    title: { type: String, default: 'Title' },
    subhead: { type: String, default: '' },
    to: { type: String, default: '/' }
  }
}
</script>

<style lang="scss">
a {
  text-decoration: none;
  color: black;
}

a:hover {
  color: $primary;
}
</style>
