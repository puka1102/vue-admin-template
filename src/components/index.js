import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload/upload.vue'
import Print from 'vue-print-nb'
import ScreenFull from './screenfull'
import ThemePicker from './ThemePicker'
import Lang from './lang'
import TagsView from './TagsView'
export default {
  install(Vue) {
    // 注册全局的通用栏组件对象
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('ImageUpload', ImageUpload)
    Vue.component('ScreenFull', ScreenFull)
    Vue.component('ThemePicker', ThemePicker)
    Vue.component('Lang', Lang)
    Vue.component('TagsView', TagsView)
    Vue.use(Print) // 注册打印组件
  }
}
