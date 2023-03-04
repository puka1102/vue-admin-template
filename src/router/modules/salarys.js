import Layout from '@/layout'

export default {
  path: '/salarys',
  name: 'salarys',
  component: Layout,
  // 配置二级路由组件
  children: [
    { path: '',
      component: () => import('@/views/salarys'),
      meta: {
        title: '工资',
        icon: 'money'
      }} // 左侧导航会读取这里的title作为显示菜单名称
  ]
}
