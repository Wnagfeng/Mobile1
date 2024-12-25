import axios from 'axios'
import {
  Toast
} from 'vant'
import router from '../router/index'

import Cookies from 'js-cookie'
import {
  baseUrl,
  baseApi
} from '../config/index'

const service = axios.create({
  baseURL: baseUrl + baseApi, // url = base api url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

service.interceptors.request.use(
  config => {
    if (Cookies.get('Token')) {
      config.headers['Authorization'] = 'Bearer ' + "1123131"
      config.headers['Content-Type'] = 'application/json'
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)
service.interceptors.response.use(
  response => {
    Toast.clear()
    const res = response.data
    if (res.status && res.status !== 200) {
      if (res.status === '401') {
        router.push({ path: '/login' })
        Cookies.set('Token', '', -1)
        sessionStorage.clear()
      }
      if (res.msg !== '非法访问') {
        Toast.fail(res.msg)
      }
      if (res.status === '500') {
        router.push({ name: 'NullPage', params: { msg: res.msg } })
      }
      return Promise.reject(res || 'error')
    } else {
      return Promise.resolve(res)
    }
  },
  error => {
    Toast.clear()
    console.log('err' + error)
    return Promise.reject(error)
  }
)

export default service
