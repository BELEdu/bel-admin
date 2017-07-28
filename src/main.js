// polyfills
import 'core-js/es6/promise'
import 'core-js/es6/set'
import 'core-js/es6/array'
import 'core-js/es7/array'
import 'core-js/es6/string'
import 'core-js/es7/string'

// 使ie9兼容placeholder属性
import '@/utils/placeholders'

// 全局样式
import '@/styles/global.less'

// app
import Vue from 'vue'
import iView from 'iview'
import { Acl, Http, Rules } from '@/utils'
import rbDog from '@/components'
import App from './App'
import router from './router'
import store from './store'

// 注册插件
Vue
  .use(iView)
  .use(rbDog)
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
