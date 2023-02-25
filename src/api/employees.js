/**
 * 员工接口
 * **/
import request from '@/utils/request' // request是一个axios实例
// 获取员工简单列表
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple'
  })
}
