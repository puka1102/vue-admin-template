import request from '@/utils/request'
// 获取组织架构的数据
export function getDepartment() {
  return request({
    url: '/company/department'
  })
}

// 删除部门数据
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}

// 添加子部门
export function addDepartments(data) {
  return request({
    url: '',
    method: 'post',
    data
  })
}
