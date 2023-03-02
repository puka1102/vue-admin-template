import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}
// 获取用户基本资料
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}
// 获取用户头像
export function getUserPhoto(id) {
  return request({
    url: `/sys/user/${id}`
  })
}
export function logout() {
}

// 获取某个用户的基本信息
export function getUserDetail(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

// 保存用户的基本信息
export function saveUserDetail(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}
