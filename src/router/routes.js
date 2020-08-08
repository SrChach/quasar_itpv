
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'carga', component: () => import('pages/LoadProducts.vue') },
      { path: 'tickets', component: () => import('pages/TicketContent.vue') },
      { path: 'customers', component: () => import('pages/LoadCustomers.vue') },
      { path: 'products', component: () => import('pages/UpdateProducts.vue') }
    ]
  },
  {
    path: '/unauthenticated',
    component: () => import('layouts/Unauthenticated.vue'),
    children: [
      { path: '', name: 'unauthenticated', component: () => import('pages/Login.vue') },
      { path: 'scripts', component: () => import('pages/Scripts.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
