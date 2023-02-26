/**
 * 公司设置模块
 * **/
import request from '@/utils/request'
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    method: 'get',
    params // params是查询参数，需要携带分页信息
  })
}

// 获取公司信息
export function getCompanyInfo(id) {
  return request({
    url: `/company/${id}`
  })
}

// 删除角色
export function deleteRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

// 获取角色详情
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'get'

  })
}

// 更新角色
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put',
    data // 不要忘记提交data
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}
