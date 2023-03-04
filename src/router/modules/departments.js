import Layout from '@/layout'

export default {
  path: '/departments',
  name: 'departments',
  component: Layout,
  // 配置二级路由组件
  children: [
    { path: '',
      component: () => import('@/views/departments'),
      meta: {
        title: '组织架构',
        icon: 'tree'
      }} // 左侧导航会读取这里的title作为显示菜单名称
  ]
}
