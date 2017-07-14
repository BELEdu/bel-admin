/**
 * Vue Ajax请求插件
 * @author lmh
 * @name Http
 * @class
 * @description 基于fetch api封装
 * @version 2017-06-05 根据后台接口的规范变动做了大量的完善
 */

import 'whatwg-fetch'
import store from '@/store'
import router from '@/router'
import { GLOBAL } from '@/store/mutationTypes'

class Http {
  static install(Vue) {
    /* eslint-disable no-param-reassign */
    Vue.prototype.$http = {
      get: Http.get,
      post: Http.post,
      patch: Http.patch,
      delete: Http.delete,
      OK: Http.OK,
      FAIL: Http.FAIL,
      ERROR: Http.ERROR,
    }
  }

  // 每次请求时，检查token
  static updateToken(res) {
    const { status, headers } = res

    // 只有登陆和token时效时，相应头会带token字段
    const token = headers.get('token')

    // token有值，则更新token（登陆时）
    if (token) {
      store.commit(GLOBAL.TOKEN.UPDATE, token)
    }

    // 状态400且token为空值，强制用户登出（token失效时）
    if (status === Http.FAIL && token === '') {
      store.commit(GLOBAL.LOGOUT)
      router.push('/auth/login')
    }

    return res
  }

  // 统一抛出错误
  static errorHandler(res) {
    if (res.ok) {
      // res.json()操作若失败，返回一个空对象
      return res.json()
        .catch(() => ({}))
    }

    return res.json()
      .then((error) => {
        throw error
      })
  }

  static getUri(uri) {
    return `${Http.HOST}${Http.VERSION}${uri}`
  }

  /**
   * GET请求
   * @param {String} uri - 请求接口
   * @returns {Promise}
   */
  static get(uri, headers = {}) {
    return fetch(Http.getUri(uri), {
      headers: {
        Authorization: `Bearer ${store.state.token}`,
        ...headers,
      },
    })
      .then(Http.updateToken)
      .then(Http.errorHandler)
  }

  /**
   * POST请求
   * @param {String} uri - 请求接口
   * @param {Object} body - 请求所需携带参数
   * @returns {Promise}
   */
  static post(uri, body, headers = {}) {
    return fetch(Http.getUri(uri), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${store.state.token}`,
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
    })
      .then(Http.updateToken)
      .then(Http.errorHandler)
  }

  /**
   * PATCH请求
   * @param {String} uri - 请求接口
   * @param {Object} body - 请求所需携带参数
   * @returns {Promise}
   */
  static patch(uri, body, headers = {}) {
    return fetch(Http.getUri(uri), {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${store.state.token}`,
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
    })
      .then(Http.updateToken)
      .then(Http.errorHandler)
  }

  /**
   * DELETE请求
   * @param {String} uri - 请求接口
   * @returns {Promise}
   */
  static delete(uri, headers = {}) {
    return fetch(Http.getUri(uri), {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${store.state.token}`,
        ...headers,
      },
    })
      .then(Http.updateToken)
      .then(Http.errorHandler)
  }
}

// 上线时需拼合为完整的接口地址
Http.HOST = process.env.NODE_ENV === 'production' ?
  'https://oa-api.caihonggou.com' : ''

// 接口版本号
Http.VERSION = '/v1'

// 响应状态
Http.OK = 200
Http.FAIL = 400
Http.ERROR = 422

export default Http
