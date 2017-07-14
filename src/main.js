// polyfills
import 'core-js/modules/es6.promise'
import 'core-js/modules/es6.string.includes'
import 'core-js/modules/es6.array.fill' // 测试
import 'core-js/modules/es6.array.find'
import 'core-js/modules/es6.array.find-index'
import 'core-js/modules/es7.array.includes'
import 'core-js/modules/es6.array.from'
import 'core-js/modules/es6.set'

import '@/utils/placeholders' // 使ie9兼容placeholder属性

// 全局样式
import '@/styles/global.less'

// app
import Vue from 'vue'
import iView from 'iview'
import { Acl, Http, Rules } from '@/utils'
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
Vue.component('app-date-picker', components.AppDatePicker)
Vue.component('app-time-picker', components.AppTimePicker)
Vue.component('app-map-cascader', components.AppMapCascader)

// 注册插件
Vue
  .use(iView)
  .use(Acl)
  .use(Http)
  .use(Rules)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})
