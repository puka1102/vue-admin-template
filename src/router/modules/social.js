import Layout from '@/layout'
// 每个子模块 外层都是layout,组件位于layout的二级路由里面
export default {
  path: '/social',
  component: Layout,
  name: 'social_securitys',
  // 配置二级路由组件
  children: [
    { path: '',
      component: () => import('@/views/social'),
      meta: {
        title: '社保',
        icon: 'table'
      }} // 左侧导航会读取这里的title作为显示菜单名称
  ]
}
