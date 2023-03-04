import Layout from '@/layout'

export default {
  path: '/setting',
  name: 'settings',
  component: Layout,
  // 配置二级路由组件
  children: [
    { path: '',
      component: () => import('@/views/setting'),
      meta: {
        title: '公司设置',
        icon: 'setting'
      }} // 左侧导航会读取这里的title作为显示菜单名称
  ]
}
