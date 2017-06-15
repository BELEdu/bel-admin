// polyfills
import 'core-js/modules/es6.promise'
import 'core-js/modules/es6.string.includes'
import 'core-js/modules/es6.array.fill' // 测试
import 'core-js/modules/es6.array.find'
import 'core-js/modules/es6.array.find-index'
import 'core-js/modules/es7.array.includes'
import 'core-js/modules/es6.set'

// 全局样式
import '@/styles/global.less'

// 组件注册
import * as components from '@/components'

// app
import Vue from 'vue'
import iView from 'iview'
import { Acl, Http, Parse } from '@/utils'
import App from './App'
import router from './router'
import store from './store'

Vue.component('app-editor-title', components.EditorTitle)
Vue.component('app-pager', components.AppPager)
Vue.component('app-form-modal', components.AppFormModal)
Vue.component('app-warn-modal', components.AppWarnModal)

// const { permissions } = store.state.user
// 尚不清楚后台返回的权限字段是什么数据格式，这里先写一个空数组代替

Vue.use(iView)
Vue.use(Acl, { router, permissions: [] })
Vue.use(Http)
Vue.use(Parse)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})
