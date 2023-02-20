import router from './router'
import store from './store'
import nProgress from 'nprogress' // 引入进度条
import 'nprogress/nprogress.css'
// 定义白名单，即不受token控制的名单
const whiteList = ['/login', '/404']
// 前置守卫
router.beforeEach(async(to, from, next) => {
  nProgress.start() // 开启进度条
  if (store.getters.token) { // 判断是否有token
    if (to.path === '/login') { // 判断是否是登录页面
      next('/')										// 有token可以跳过登录页面
    } else {
      // 判断是否有用户id
      if (!store.getters.userId) {
        await store.dispatch('user/getUserInfo')
        next() // 有token可以放行
      }
    }
  } else {
    if (whiteList.indexOf(to.path) > -1) {
      next() // 在白名单中放行
    } else {
      next('/login')
    }
  }
  nProgress.done() // 解决手动切换路由时
})
// 后置守卫,路由切换完成后调用
router.afterEach(() => {
  nProgress.done()
})
