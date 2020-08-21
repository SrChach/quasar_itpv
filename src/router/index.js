import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function ({ store /* ,ssrContext */ }) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  Router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresActivation)) {
      if (!store.getters['security/getIsActivated']) {
        next('/unactivated')
      } else {
        if (to.matched.some(record => record.meta.requiresAuth)) {
          // Si no está autenticado, manda a una ruta
          if (!store.getters['security/getIsAuthenticated']) {
            console.log('entra')
            next('/unauthenticated')
          } else {
            next() // Si lo está, lo deja pasar
          }
        } else {
          next() // Si no requiere autenticación, asegúrate de siempre llamar a next()!
        }
      }
    } else {
      next()
    }
  })

  return Router
}
