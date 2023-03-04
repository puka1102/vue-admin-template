import { login, getUserInfo, getUserPhoto } from '@/api/user'
import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { resetRouter } from '@/router'
// import { resolve } from 'core-js/library/es6/promise'
// 状态
const state = {
  token: getToken(), // 设置Token初始状态
  userInfo: {}
}
// 修改状态
const mutations = {
  // 设置token
  setToken(state, token) {
    state.token = token
    setToken(token) // 将token缓存
  },
  // 删除token
  removeToken(state) {
    state.token = null
    removeToken() // 同步到缓存
  },
  // 设置用户资料
  setUserInfo(state, result) {
    state.userInfo = result // 响应式
  },
  // 删除用户信息，退出登录时需要
  removeUserInfo(state) {
    state.userInfo = {}
  }

}
// 登陆的action
const actions = {
  // user login
  async login(context, data) {
    const result = await login(data)
    // 通过mutations修改state
    context.commit('setToken', result)
    // 写入时间戳
    setTimeStamp()
  },
  // 获取用户资料
  async getUserInfo(context) {
    const result = await getUserInfo()
    // 获取用户头像
    const userPhoto = await getUserPhoto(result.userId)
    context.commit('setUserInfo', { ...result, ...userPhoto }) // 传入合并后的数据
    return result // 做权限时需要
  },
  // 登出操作
  logout(context) {
    // 删除token
    context.commit('removeToken')
    // 删除用户资料
    context.commit('removeUserInfo')
    // 重置路由
    resetRouter()
    // 重置权限模块下的路由
    context.commit('permission/setRoutes', [], { root: true }) // 调用根级的子模块
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

