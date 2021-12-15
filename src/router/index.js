import Vue from 'vue'
import Router from 'vue-router'
import baseLayout from '@/layout/baseLayout.vue'
import Index from '@/views/index/index.vue'
import Detail from '@/views/detail/index.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'baseLayout',
    component: baseLayout,
    redirect: '/index',
    children: [
      {
        path: '/index',
        name: 'Index',
        component: Index
      },
      {
        path: '/detail',
        name: 'Detail',
        component: Detail // 异步加载会失效
      }
    ]
  }]
})
