import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue')
      },
      {
        path: 'system/user',
        name: 'User',
        component: () => import('@/views/system/user/index.vue')
      },
      {
        path: 'system/role',
        name: 'Role',
        component: () => import('@/views/system/role/index.vue')
      },
      {
        path: 'system/permission',
        name: 'Permission',
        component: () => import('@/views/system/permission/index.vue')
      },
      {
        path: 'system/dept',
        name: 'Dept',
        component: () => import('@/views/system/dept/index.vue')
      },
      {
        path: 'tool/dict',
        name: 'Dict',
        component: () => import('@/views/tool/dict/index.vue')
      },
      {
        path: 'tool/config',
        name: 'Config',
        component: () => import('@/views/tool/config/index.vue')
      },
      {
        path: 'monitor/log',
        name: 'Log',
        component: () => import('@/views/monitor/log/index.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router