// 多语言实例化文件
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookie from 'js-cookie' // 保存到cookie
import elementEN from 'element-ui/lib/locale/lang/en' // 引入饿了么的英文包
import elementZH from 'element-ui/lib/locale/lang/zh-CN' // 引入饿了么的中文包
import customEN from './en' // 自定义语言
import customZH from './zh'
Vue.use(VueI18n) // 全局注册
export default new VueI18n({
// i18n的选项
  locale: Cookie.get('language') || 'zh', // 当前多语言类型，可以自定义
  messages: {
    en: {
      ...elementEN, // 引入饿了么的英文语言包
      ...customEN
    },
    zh: {
      ...elementZH, // 引入饿了么的中文语言包
      ...customZH
    }
  } // 当前语言包
})
