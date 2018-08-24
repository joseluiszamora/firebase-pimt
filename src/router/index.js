import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/components/Home')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/components/Login')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/components/Dashboard/Layout'),
    children: [
      {
        path: 'indicators',
        name: 'dashboard.indicators',
        component: () => import('@/components/Dashboard/Indicators')
      },
      {
        path: 'backup',
        name: 'dashboard.backup',
        component: () => import('@/components/Dashboard/Backup')
      },
      {
        path: 'logs',
        name: 'dashboard.logs',
        component: () => import('@/components/Dashboard/Logs')
      }
    ]
  },
  {
    path: '/messages',
    name: 'messages',
    component: () => import('@/components/Messages/Layout'),
    children: [
      {
        path: 'index',
        name: 'messages.index',
        component: () => import('@/components/Messages/Index')
      },
      {
        path: 'new',
        name: 'messages.new',
        component: () => import('@/components/Messages/New')
      }
    ]
  },
  {
    path: '/usuarios',
    name: 'usuarios',
    component: () => import('@/components/Usuarios/Layout'),
    children: [
      {
        path: 'index',
        name: 'usuarios.index',
        component: () => import('@/components/Usuarios/Index')
      },
      {
        path: 'grupos',
        name: 'usuarios.grupos',
        component: () => import('@/components/Usuarios/Grupos')
      }
    ]
  }
]

export default new VueRouter({
    mode: 'history',
    routes
})
