export default [
  {
    path: '/',
    name: 'dashborad',
    component: () => import('@/views/Dashboard/index.vue'),
    meta: {
      title: '首页',
      icon: 'DashboardOutlined'
    }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404.vue'),
    meta: {
      title: '404',
      hide: true
    }
  }
]
