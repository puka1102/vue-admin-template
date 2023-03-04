// 可以让所有的组件都拥有一个公共的方法
import store from '@/store'
export default {
  methods: {
    // 检查权限
    checkPermission(key) {
      const { userInfo } = store.state.user
      if (userInfo.roles && userInfo.roles.points) {
        return userInfo.roles.points.some(item => item === key)
      }
      return false
    }
  }
}
