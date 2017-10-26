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
import student from './student'
import label from './label'
import question from './question'
import algorithm from './algorithm'
import examination from './examination'
import prepare from './prepare'
import utils from './utils'
import setting from './setting'
import { GLOBAL } from './mutationTypes'

Vue.use(Vuex)

const store = new Vuex.Store({
  plugins: [
    // 持久化应用状态
    createPersistedState({
      paths: [
        'token',
        'user',
        'roles',
        'permissions',
        'dicts',
      ],
    }),
  ],

  modules: {
    student,
    system,
    label,
    question,
    algorithm,
    examination,
    prepare,
    utils,
    setting,
  },

  state: {
    token: '', // 用户凭证
    user: {}, // 用户相关信息
    roles: [], // 用户角色立标
    permissions: [], // 用户权限列表（含菜单）
    dicts: {}, // 字典数据
    loading: false,
  },

  getters: {
    // 获取当前用户的当前角色
    currentRole(state) {
      return state.roles.find(role => +role.id === +state.user.role_id)
    },

    // 获取当前用户的其它角色列表
    otherRoles(state) {
      return state.roles.filter(role => +role.id !== +state.user.role_id)
    },

    permissionsNames(state) {
      const flat = items => items.reduce((result, item) => [
        ...result,
        item.name,
        ...(item.children ? flat(item.children) : []),
      ], [])

      return flat(state.permissions)
    },
  },

  mutations: {
    [GLOBAL.TOKEN.UPDATE](state, token) {
      state.token = token
    },

    [GLOBAL.USER.UPDATE](state, info) {
      state.info = { ...state.info, ...info }
    },

    [GLOBAL.ROLES.UPDATE](state, roles) {
      state.roles = roles
    },

    [GLOBAL.PERMISSIONS.UPDATE](state, permissions) {
      state.permissions = permissions
    },

    [GLOBAL.DICTS.INIT](state, dicts) {
      state.dicts = dicts
    },

    // 登录
    [GLOBAL.LOGIN](state, { user, roles, permissions }) {
      state.user = user
      state.roles = roles
      state.permissions = permissions
    },

    // 登出
    [GLOBAL.LOGOUT](state) {
      state.token = ''
      state.user = {}
      state.roles = []
      state.permissions = []
      state.dicts = {}
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
    // 获取字典
    [GLOBAL.DICTS.INIT]({ state, commit }) {
      // 缓存了字典数据，只有当无数据时才重新做请求
      if (Object.keys(state.dicts).length === 0) {
        return Http.get('/dict')
          .then(res => commit(GLOBAL.DICTS.INIT, res))
      }
      return Promise.resolve()
    },

    // 登录
    [GLOBAL.LOGIN]({ commit }, data) {
      return Http.post('/auth/login', data)
        .then(res => commit(GLOBAL.LOGIN, res))
    },

    // 切换角色
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
