/**
 * Vue 权限控制插件
 * @author lmh
 * @name Acl
 * @class
 * @description permissions是当前登陆用户的所拥有的全部权限
 * @version 2017-06-01 lmh 允许传入多个权限
 */

import router from '@/router'
import store from '@/store'

export default class Acl {
  static install(Vue) {
    /**
     * 权限判断
     * @description 判断当前用户是否拥有某个所需权限
     * @param {String} as - 所需权限，多个权限用'|'隔开
     * @returns {Boolean}
     */

    const can = as => as
      .split('|')
      .some(permission => store.getters.permissionsNames.includes(permission))

    // eslint-disable-next-line
    Vue.prototype.$can = can

    // 在进入每个路由页面前先做权限判断
    // 如果某个路由页的配置中设置了权限要求，且当前用户不满足该权限要求，转跳到错误页面
    // 路由配置中未设置权限要求，或当前用户满足该权限要求，则正常进入该路由页
    router.beforeEach((to, from, next) => {
      const { as } = to.meta

      if (as && !can(as)) {
        next('/error')
      } else {
        next()
      }
    })
  }
}
