/**
 * 路由设置
 * @author lmh
 * @description meta.as用来指定访问该路由所需的权限，多个权限用'|'隔开
 */

import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import * as views from '@/views'
import { GLOBAL } from '@/store/mutationTypes'

// 路由模块插入
import business from './business'
import analysis from './analysis'
import system from './system'
import student from './student'
import examination from './examination'
import prepare from './prepare'
import question from './question'
import algorithm from './algorithm'
import setting from './setting'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/auth/login',
      name: 'Login',
      component: views.Login,
      meta: {
        breadcrumb: [
          { name: '登录' },
        ],
      },
    },
    {
      path: '/',
      name: 'Main',
      component: views.Main,
      children: [
        {
          path: '/index/tongjitu',
          name: 'Index',
          component: views.Home,
          meta: {
            breadcrumb: [
              { name: '我的首页' },
              { name: '统计图' },
            ],
          },
        },
        ...business,
        ...analysis,
        ...system,
        ...student,
        ...examination,
        ...prepare,
        ...question,
        ...algorithm,
        ...setting,
        {
          path: '/error',
          name: 'AccessError',
          component: views.AccessError,
        },
        {
          path: '*',
          name: '404',
          component: views.NotFound,
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  // 显示数据加载动画
  if (to.name !== '404') {
    store.commit(GLOBAL.LOADING.SHOW)
  }

  // 更换页面title
  if (to.meta.breadcrumb) {
    document.title = to.meta.breadcrumb
      .reduce((title, item) => (
        title ? `${item.name} - ${title}` : item.name
      ), '')
  }

  next()
})

export default router
