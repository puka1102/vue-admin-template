import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}
// 获取用户基本资料
export function getUserInfo(token) {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

export function logout() {

}
