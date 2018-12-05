import axios from 'axios'
import config from '../config'

var http = axios.create({
  baseURL: config.plataformaTeleferico,
  headers: {}
})

http.verifyToken = function (token) {
  return http.get('api/tokens/verifyToken?access_token=' + token)
}

http.decodeToken = function (token) {
  return http.get('api/tokens/decodeToken?token=' + token)
}

export default http
