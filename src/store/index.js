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
import business from './business'
import { GLOBAL } from './mutationTypes'

Vue.use(Vuex)

const store = new Vuex.Store({
  plugins: [
    // 持久化应用状态
    createPersistedState({
      paths: [
        'token',
        'user',
        'menus',
        'roles',
        'permissions',
      ],
    }),
  ],

  modules: {
    system,
    business,
  },

  state: {
    token: '',
    user: {},
    menus: [],
    roles: [],
    permissions: [],
    loading: false,
  },

  getters: {
    currentRole(state) {
      return state.roles.find(role => +role.id === +state.user.role_id)
    },

    otherRoles(state) {
      return state.roles.filter(role => +role.id !== +state.user.role_id)
    },
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

    // 更新用户角色列表
    [GLOBAL.ROLES.UPDATE](state, roles) {
      state.roles = roles
    },

    // 更新用户权限
    [GLOBAL.PERMISSIONS.UPDATE](state, permissions) {
      state.permissions = permissions
    },

    // 登录
    [GLOBAL.LOGIN](state, { user, menus, roles, permissions }) {
      state.user = user
      state.menus = menus
      state.roles = roles
      state.permissions = permissions
    },

    // 登出
    [GLOBAL.LOGOUT](state) {
      state.token = ''
      state.user = {}
      state.menus = []
      state.roles = []
      state.permissions = []
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
        .then(res => commit(GLOBAL.LOGIN, res))
    },

    [GLOBAL.SWITCH]({ commit }, id) {
      return Http.get(`/switch_role/${id}`)
        .then(res => commit(GLOBAL.LOGIN, res))
    },

    // 登出
    [GLOBAL.LOGOUT]({ commit }) {
      return Http.get('/auth/logout')
        .then(() => commit(GLOBAL.LOGOUT))
    },
  },
})

export default store
