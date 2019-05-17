import axios from 'axios'
import { message } from 'antd'
import userStore  from '../store/proxy-user'

const CancelToken = axios.CancelToken
const source = CancelToken.source()
message.config({
  maxCount: 1
})

export default class BaseModule {
  constructor() {
    this.$http = axios.create({
      timeout: 10000,
      baseURL: '/api/plan-box',
      withCredentials: true
    })
    this.$http.interceptors.request.use(request => {
      const whiteList = [
        'oauth/userInfo',
      ]
      if (!userStore.isLogin && !whiteList.includes(request.url)) {
        request.cancelToken = source.token
        source.cancel(`请求: ${request.url}被取消`)
      }
      return request
    })
    this.$http.interceptors.response.use(response => {
      // 如果状态码正确并且含有msg字段,代表需要使用Message组件提示
      if (response.status === 200) {
        if (!response.data.errno) {
          response.data.msg && message.success(response.data.msg)
          return response.data
        } else {
          response.data.msg && message.error(response.data.msg)
          return Promise.reject(null)
        }
      }
    }, error => {
      if (axios.isCancel(error)) {
        message.info('请求被取消, 请登录后再操作')
      } else {
        message.error('Server Error')
      }
      return Promise.reject(error)
    })
  }
  get(url, config={}){
    return this.$http.get(url, config)
  }
  post(url, data={}, config={}){
    return this.$http.post(url, data, config)
  }
  put(url, data={}, config={}){
    return this.$http.put(url, data, config)
  }
  delete(url, config){
    return this.$http.delete(url, config)
  }
}
