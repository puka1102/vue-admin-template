// 导入静态路由和动态路由
import { constantRoutes, asyncRoutes } from '@/router'
const state = {
  routes: constantRoutes // 所有人默认拥有静态路由
}
const mutations = {
  setRoutes(state, newRoutes) {
    // newRoutes是动态路由,所以要在静态路由的基础上添加，而不是在state的基础上添加
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  filterRoutes(context, menus) {
    // menus是当前用户所拥有的菜单权限,要与动态路由匹配
    const routes = []
    menus.forEach(key => {
      routes.push(... asyncRoutes.filter(item => item.name === key)) // filter结果是数组，需要解构才能push
    })
    context.commit('setRoutes', routes)
    return routes
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
