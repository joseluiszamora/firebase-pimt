import axios from 'axios'
import config from '../config'

var http = axios.create({
  baseURL: config.fcmUrl,
  headers: {
    'Authorization': 'Bearer AIzaSyAdmQbp_mJ859XeEQFP1k5bISU173CIFvw',
    'Content-Type': 'application/json'
  }
})

http.getValorProporcionalObra = function (codigoLinea) {
  return http.get('obra/getvalorproporcional/' + codigoLinea)
}
http.sendMessage = function () {
  let token = 'emEbMgxCNs8:APA91bHEPWs9DlFe6__ZlspbRZqoOKF4aFbnFs-UUd3z4kiAzq1Sg1gQYgOrEMJ8bApIlgS4_UlqcOZknDA_6i5QbLrxnYESRW255NEl4xUy6je1ilZmx67kPHVkzP3W5yyNIxiuSx-vEmwDKzeqnRjkk8BB6QcGGA'
  let message = `"message":{"token":"${token}","notification":{"body":"This is an FCM notification message!","title":"FCM Message"}}`
  // return http.post('/messages:send HTTP/1.1', message)
  return http.post('/messages:send', message)
}

export default http
