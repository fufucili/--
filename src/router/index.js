import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/layout/index.vue'),
    redirect: '/index',
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/index/index.vue')
      },
      {
        path: 'clazz',
        name: 'clazz',
        component: () => import('@/views/clazz/index.vue')
      },
      {
        path: 'stu',
        name: 'stu',
        component: () => import('@/views/stu/index.vue')
      },
      {
        path: 'emp',
        name: 'emp',
        component: () => import('@/views/emp/index.vue')
      },
      {
        path: 'dept',
        name: 'dept',
        component: () => import('@/views/dept/index.vue')
      },
      {
        path: 'empReport',
        name: 'empReport',
        component: () => import('@/views/report/emp/index.vue')
      },
      {
        path: 'stuReport',
        name: 'stuReport',
        component: () => import('@/views/report/stu/index.vue')
      },
      {
        path: 'log',
        name: 'log',
        component: () => import('@/views/log/index.vue')
      },
      {
        path: 'changePassword',
        name: 'changePassword',
        component: () => import('@/views/changePass/index.vue')
      }
    ]
  },
  {
    path: '/login',
    name: '/login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/changePassword',
    name: '/changePassword',
    component: () => import('@/views/changePass/index.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
