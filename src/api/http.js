import axios from 'axios'
import qs from 'qs'
import { Loading } from 'element-ui'
import store from '../store/index'
import router from '../router'

// 创建实例
const instance = axios.create({
  baseURL: 'http://...',
  timeout: 5000
})

// 加载中...
let loadingInstance

// 请求拦截
instance.interceptors.request.use(
  config => {
    loadingInstance = Loading.service({
      lock: true,
      text: '加载中...'
    })
    // 请求头
    const token = store.state.token
    if (token) {
      config.headers.Authorization = token
    }
    // 改为 等号 拼接
    if (config.method === 'post') {
      config.data = qs.stringify(config.data)
    }
    return config
  },
  err => {
    return err
  }
)

// 响应拦截
instance.interceptors.response.use(
  result => {
    if (result.status === 404 && router.currentRoute.fullPath !== '/404') {
      // 404页
      router.replace('/404')
    }
    loadingInstance.close()
    // 返回result.data, 就不需要每次都.data 了
    return result.data
  },
  err => {
    loadingInstance.close()
    if (
      err.code === 'ECONNABORTED' &&
      err.message.indexOf('timeout') !== -1 &&
      !err.config._retry
    ) {
      return Promise.reject('卧槽！这个这个请求失败了，原因是：请求超时')
    }
    return Promise.reject('卧槽！这个这个请求失败了，原因是：' + err)
  }
)

export default instance
