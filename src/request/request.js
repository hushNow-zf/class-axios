import axios from 'axios'
import { Message } from 'element-ui'
import AuthToken from './auth-token'

const statusMap = {
  400: '请求错误',
  401: '未授权，请重新登录',
  403: '拒绝访问',
  404: '请求出错',
  408: '请求超时',
  500: '服务器错误',
  501: '服务器未实',
  502: '网络错误',
  503: '服务不可用',
  504: '网络超时',
  505: '网络超时'
}

const baseConfig = {
  baseURL: process.env.NODE_ENV === 'production' ? '' : '/api',
  timeout: 20 * 1000
}

const service = axios.create(baseConfig)
class Request {
  constructor (service, tokenKey) {
    this.service = service
    this.tokenKey = tokenKey
    this.authToken = new AuthToken(tokenKey)
    this.insMessage = null
    this.interceptor()
  }

  interceptor () {
    this.service.interceptors.request.use((config) => {
      const token = this.authToken.getToken() || localStorage.getItem(this.tokenKey)
      if (token) {
        config.headers.common.authorization = token
      }
      if (config.isMessage) {
        this.insMessage = Message({
          dangerouslyUseHTMLString: true,
          duration: 0,
          iconClass: 'el-icon-loading',
          message: '&nbsp;请稍后...'
        })
      }
      return config
    }, (err) => {
      this.closeMessage()
      err.data = {}
      err.data.message = '服务器异常'
      Message.error('服务器异常')
      return Promise.reject(err)
    })
    this.service.interceptors.response.use((response) => {
      const { status } = response
      this.closeMessage()
      if (status === 200 || status === 304) {
        return response
      } else {
        const message = statusMap[status] || `链接出错${status}`
        if (typeof response.data === 'string') {
          response.data = { message }
        } else {
          response.data.message = message
        }
      }
      return response
    }, (err) => {
      console.log(err)
      this.closeMessage()
      err.data = {}
      err.data.message = '请求超时或者服务器异常，请联系管理员'
      Message.error('请求超时或者服务器异常，请联系管理员')
      return Promise.reject(err)
    })
  }

  closeMessage () {
    if (this.insMessage) {
      this.insMessage.close()
      this.insMessage = null
    }
  }

  get (url, params, option = {}) {
    return this.service.get(url, { params, ...option })
  }

  post (url, params, option = {}) {
    return this.service.post(url, { params, ...option })
  }
}

export default new Request(service, 'my_token')
