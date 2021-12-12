import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import Layout from '../layout/index'

export const routerMap = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../login.vue')
  },
  {
    path: '/401',
    name: '401',
    component: () => import('../views/error/401')
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/error/404')
  },
  {
    path: '/Layout',
    name: 'Layout',
    component: Layout,
    children: [
      {
        path: '/home',
        name: 'Home',
        component: Home
      }
    ]
  }
]

const routers = createRouter({
  history: createWebHistory(),
  routes: routerMap
})

export default routers
