import Layout from '@/layout'

export default {
  path: '/attendances',
  name: 'attendances',
  component: Layout,
  // 配置二级路由组件
  children: [
    { path: '',
      component: () => import('@/views/attendances'),
      meta: {
        title: '考勤',
        icon: 'skill'
      }} // 左侧导航会读取这里的title作为显示菜单名称
  ]
}
