
const routes = [
  {
    name: 'main',
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'login', component: () => import('pages/Login.vue') },
      { path: '/logout', name: 'logout', component: () => import('pages/Login.vue') },
      { path: '/system', name: 'system', component: () => import('pages/System.vue') },
      { path: '/users', name: 'users', component: () => import('pages/Users.vue') },
      { path: '/groups', name: 'groups', component: () => import('pages/Groups.vue') },
    ]
  },
  {
    path: '*',
    component: () => import('pages/System.vue')
  }
]

export default routes
