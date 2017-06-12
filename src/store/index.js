/**
 * 全局状态
 * @author lmh
 * @version 2017-06-06
 */

import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import { Http } from '@/utils'
import system from './system'
import biz from './biz'
import { GLOBAL } from './mutationTypes'

Vue.use(Vuex)

const store = new Vuex.Store({
  plugins: [
    // 持久化应用状态
    createPersistedState(),
  ],

  modules: {
    system,
    biz,
  },

  state: {
    token: '',
    user: {},
    menus: [],
    loading: false,
  },

  mutations: {
    // 更新token
    [GLOBAL.TOKEN.UPDATE](state, token) {
      state.token = token
    },

    // 更新用户信息
    [GLOBAL.USER.UPDATE](state, info) {
      state.info = { ...state.info, ...info }
    },

    // 更新菜单
    [GLOBAL.MENUS.UPDATE](state, menus) {
      state.menus = menus
    },

    // 登录
    [GLOBAL.LOGIN](state, { user, menus }) {
      state.user = user
      state.menus = menus
    },

    // 登出
    [GLOBAL.LOGOUT](state) {
      state.token = ''
      state.user = {}
      state.menus = []
    },

    // 显示加载动画
    [GLOBAL.LOADING.SHOW](state) {
      state.loading = true
    },

    // 隐藏加载动画
    [GLOBAL.LOADING.HIDE](state) {
      state.loading = false
    },
  },

  actions: {
    // 登录
    [GLOBAL.LOGIN]({ commit }, data) {
      return Http.post('/auth/login', data)
        .then(({ user, menus }) => {
          commit(GLOBAL.LOGIN, { user, menus })
        })
    },

    // 登出
    [GLOBAL.LOGOUT]({ commit }) {
      return Http.get('/auth/logout')
        .then(() => {
          commit(GLOBAL.LOGOUT)
        })
    },
  },
})

export default store
