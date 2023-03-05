import Layout from '@/layout'

export default {
  path: '/permission',
  name: 'permissions',
  component: Layout,
  // 配置二级路由组件
  children: [
    { path: '',
      component: () => import('@/views/permission'),
      name: 'permissions',
      meta: {
        title: '权限管理',
        icon: 'lock'
      }} // 左侧导航会读取这里的title作为显示菜单名称
  ]
}
