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

// app
import Vue from 'vue'
import iView from 'iview'
import { Acl, Http, Parse, Rules } from '@/utils'
import * as components from '@/components'
import App from './App'
import router from './router'
import store from './store'

// 注册全局组件
Vue.component('app-editor-title', components.EditorTitle)
Vue.component('app-pager', components.AppPager)
Vue.component('app-form-modal', components.AppFormModal)
Vue.component('app-warn-modal', components.AppWarnModal)
Vue.component('app-form-alert', components.AppFormAlert)
Vue.component('app-dicts-filter', components.AppDictsFilter)
Vue.component('app-uploader', components.AppUploader)
Vue.component('app-knowledge-tree', components.AppKnowledgeTree)

// 注册插件
Vue
  .use(iView)
  // 尚不清楚后台返回的权限字段是什么数据格式，这里先写一个空数组代替
  .use(Acl, { router, permissions: [] })
  .use(Http)
  .use(Parse)
  .use(Rules)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})
