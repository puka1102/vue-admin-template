import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import Component from '@/components'
import * as filters from '@/filters' // 引入过滤器
import * as directives from '@/directives'
import checkPermission from '@/mixin/checkPermission'
import i18n from '@/lang' // 引入多语言包

// 遍历注册自定义指令
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})
// 遍历注册过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]) // vue.filter(名字，函数)
})
// set ElementUI lang to EN
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key) // t方法会去对应的语言包里找对应的语言
  // 改变locale的值就可以改变语言
})
Vue.use(Component)
// 全局混入检查对象
Vue.mixin(checkPermission)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
