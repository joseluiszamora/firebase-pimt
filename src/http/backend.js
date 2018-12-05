import axios from 'axios'
import config from '../config'

var http = axios.create({
  baseURL: config.apiUrl,
  headers: {
  }
})

http.getUsuarios = function () {
  return http.get('/usuario/')
}
http.getAllUsuarios = function () {
  return http.get('/usuario/todos')
}
// GET usuarios que no pertenezca a este grupo
http.getAllUsuariosImportar = function (idGrupo) {
  return http.get('/usuario/importar/' + idGrupo)
}

// USUARIOS GRUPO
http.getUsuariosGrupo = function (idGrupo) {
  return http.get('/agrupacion/usuarios/' + idGrupo)
}

// GRUPOS
http.getAllGrupos = function () {
  return http.get('/grupo/todos')
}
http.saveGrupo = function (grupo) {
  return http.post('/grupo/create', grupo)
}
http.saveAgrupacion = function (agrupacion) {
  return http.post('/agrupacion/crearbloque', agrupacion)
}

// IMAGENES
http.saveImage = function (image) {
  return http.post('archivo/saveimage/', image)
}
// MENSAJES
http.saveMensaje = function (mensaje) {
  return http.post('/mensaje/create', mensaje)
}
http.getAllMensajes = function () {
  return http.get('/mensaje')
}
http.getUsuariosMensaje = function (idMensaje) {
  return http.get('/usuariomensaje/usuarios/' + idMensaje)
}
http.sendMessage = function (mensaje) {
  // let token = 'emEbMgxCNs8:APA91bHEPWs9DlFe6__ZlspbRZqoOKF4aFbnFs-UUd3z4kiAzq1Sg1gQYgOrEMJ8bApIlgS4_UlqcOZknDA_6i5QbLrxnYESRW255NEl4xUy6je1ilZmx67kPHVkzP3W5yyNIxiuSx-vEmwDKzeqnRjkk8BB6QcGGA'
  // let message = `"message":{"token":"${token}","notification":{"body":"This is an FCM notification message!","title":"FCM Message"}}`
  // return http.post('/messages:send HTTP/1.1', message)
  return http.post('/mensaje/send', mensaje)
}

// Facturas
http.getAllFacturas = function () {
  return http.get('/factura/todos')
}
http.deleteFactura = function (id) {
  return http.post('/factura/delete', `id=${id}`)
}

export default http
