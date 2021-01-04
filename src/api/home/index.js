import http from '../http'

// 使用 http 请求数据
export function postData(data) {
  return http({
    url: '',
    method: 'post',
    data: data
  })
}
