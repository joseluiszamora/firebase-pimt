import Vue from 'vue'
import Router from 'vue-router'
import config from '@/config'
import http from '@/http/auth'
import store from '@/store/index'

Vue.use(Router)

const router = new Router({
  routes: [
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
    },
    {
      path: '/facturas',
      name: 'facturas',
      component: () => import('@/components/Facturas/Layout'),
      children: [
        {
          path: 'index',
          name: 'facturas.index',
          component: () => import('@/components/Facturas/Index')
        }
      ]
    }
  ],
  mode: 'history'
})

/**
 * Check if user logged in before redirect Route
 */
router.beforeEach((to, from, next) => {
  // console.log(to)
  const session = store.state.session

  if (to.name == 'home' && to.query.access_token != null) {
    http.decodeToken(to.query.access_token).then(res => {
      console.log('Seteando INFO')

      session.isLoggedIn = true
      session.token = to.query.access_token
      session.username = res.data.data.username
      session.tipoUsuario = 'usuario'
      session.ci = 'ci'
      session.nombreCompleto = (res.data.data.nombres + ' ' + res.data.data.apellidos)
      session.imagen = res.data.data.foto
      // save fullname && Token in local Storage
      localStorage.setItem('token', to.query.access_token || '')
      localStorage.setItem('username', res.data.data.username || '')
      localStorage.setItem('tipoUsuario', 'usuario' || '')
      localStorage.setItem('ci', 'ci' || '')
      localStorage.setItem('nombreCompleto', (res.data.data.nombres + ' ' + res.data.data.apellidos) || '')
      localStorage.setItem('imagen', res.data.data.foto || '')
      router.push('/')
    }, (error) => {
      console.log(error)
    })
  } else {
    if(!session.isLoggedIn) { // si no esta logueado, salir a la plataforma
      location.href = config.plataformaTeleferico
    }
  }

  next()
  /*if (to.name !== 'login') {
    const session = store.state.session
    if (session.isLoggedIn && session.token !== '') {
      console.log('There is a token, resume. (' + to.path + ')')
      next()
    } else {
      console.log('Mot Logged, redirect to login Route')
      next('/login')
    }
  } else {
    console.log('Login Page')
    next()
  }*/
})

export default router