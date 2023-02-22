import Layout from '@/layout'

export default {
  path: '/employees',
  // name: 'employees',
  component: Layout,
  // 配置二级路由组件
  children: [
    { path: '',
      component: () => import('@/views/employees'),
      meta: {
        title: '员工管理',
        icon: 'people'
      }} // 左侧导航会读取这里的title作为显示菜单名称
  ]
}
