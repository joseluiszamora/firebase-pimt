import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
import config from '../config'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    codigoLinea: '',
    obraSelected: null,
    baseURL: config.publicUrl,
    apiURL: config.apiUrl,
    session: {
      isLoggedIn: !!localStorage.getItem('token'),
      token: localStorage.getItem('token') || '',
      username: localStorage.getItem('username') || '',
      tipoUsuario: localStorage.getItem('tipoUsuario') || '',
      ci: localStorage.getItem('ci') || '',
      nombreCompleto: localStorage.getItem('nombreCompleto') || '',
      imagen: localStorage.getItem('imagen') || ''
    }
  },
  mutations: {
    setCodigoLinea (state, payload) {
      state.codigoLinea = payload
    },
    loginSuccess (state, payload) {
      state.session.isLoggedIn = true
      state.session.token = payload.token
      state.session.username = payload.username
      state.session.tipoUsuario = payload.tipoUsuario
      state.session.ci = payload.ci
      state.session.nombreCompleto = payload.nombreCompleto
      state.session.imagen = payload.imagen
      // save fullname && Token in local Storage
      localStorage.setItem('token', payload.token || '')
      localStorage.setItem('username', payload.username || '')
      localStorage.setItem('tipoUsuario', payload.tipoUsuario || '')
      localStorage.setItem('ci', payload.ci || '')
      localStorage.setItem('nombreCompleto', payload.nombreCompleto || '')
      localStorage.setItem('imagen', payload.imagen || '')
      router.push('/')
    },
    logout (state) {
      state.session.isLoggedIn = false
      // remove localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('tipoUsuario')
      localStorage.removeItem('ci')
      localStorage.removeItem('nombreCompleto')
      localStorage.removeItem('imagen')
      state.session.username = ''
      state.session.token = ''
      console.log('bye')
      // router.push('/login')
      location.href = config.plataformaTeleferico
    },
    setPageTitle (state, payload) {
      state.layout.title = payload
    }
  },
  getters: {
    getCodigoLinea (state) {
      return state.codigoLinea
    },
    getSession (state) {
      return state.session
    }
  },
  actions: {
    setCodigoLinea ({ commit, state }, values) {
      commit('setCodigoLinea', values)
    }
  }
})

export default store
