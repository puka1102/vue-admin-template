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
      if (!store.getters.userId) { // 没有用户id，说明没有获取过用户资料，就要先获取
        const { roles } = await store.dispatch('user/getUserInfo')
        // 筛选用户的可用路由
        const routes = await store.dispatch('permission/filterRoutes', roles.menus) // 传参
        // routes是动态路由，需要添加到路由表中，addRoutes是router实例的方法
        console.log(routes)
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }]) // 404必须放到最后
        next(to.path) // 重定向了一次
      } else {
        next() // 有用户id就放行
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
