/**
 * 业务管理状态
 * @author hjz
 * @version 2017-06-08
 */

/* eslint-disable */
import { Http } from '@/utils'
import { BIZ } from '../mutationTypes'
// import router from '@/src/router'
// import store from '@/src/store'

export default {
  state: {
    buffer: null,
    unit: null,
    routeType: '',
  },

  getters: {
    bizApi(state) {
      // switch(state.routeType)
      // hotline \ comm \ contract \ product
      // return { init: | create: | update: 更新数据后端api | delete: | edit: 获取item详细信息api }
    }
  },

  actions: {
    // index 初始化 
    [BIZ.INIT]({ commit, getters }, query) {
      const current_page = query.current_page ? query.current_page : 1
      const per_page = query.per_page ? query.per_page : 10
      return Http.get(`${bizApi.init}?current_page=${current_page}&&?per_page=${per_page}`)
        .then(res => commit(BIZ.INIT, res))
    },
    // 编辑页面 初始化
    [BIZ.EDIT]({ commit, getters }, id) {
      if (id) {
        return Http.get(`${bizApi.edit}?id=${id}`).then(res => commit(BIZ.EDIT, res))
      }
    },
    // 编辑页面 提交添加信息
    [BIZ.CREATE]({ dispatch }, payload) {
      // 提交成功后回到index组件
      return Http.post(bizApi.create, payload)
        .then(() => commit(BIZ.CREATE))
        // .then(() => dispatch(BIZ.INIT))
    },
    // 编辑页面 提交修改信息
    [BIZ.UPDATE]({ dispatch }, payload) {
      // 提交成功后回到index组件
      return Http.patch(bizApi.update, payload)
        .then(() => commit(BIZ.UPDATE))
        // .then(() => dispatch(BIZ.INIT))
    },
    // index页面 删除信息
    [BIZ.DELETE]({ commit }, id) {
      return Http.delete(`${biz.delete}?id=${id}`).then(() => commit(BIZ.DELETE, id))
    },
  },

  mutations: {
    [BIZ.INIT](state, res) {
      // res是否要做处理
      state.buffer = res
    },
    // 在router的钩子中使用
    [BIZ.ROUTE](state, type) {
      state.routeType = type
     },
    [BIZ.EDIT](state, payload) {
      if (payload) state.unit = payload
      // else state.unit = store.getters.bizUnit
    },
    // 暂时不用commit(BIZ.CREATE | BIZ.UPDATE)，提交成功之后回到第一页（并重新发送第一页数据请求）
    [BIZ.CREATE](state) {
      state.unit = null
    },
    [BIZ.UPDATE](state) {
      state.unit = null
    },
    [BIZ.DELETE](state, id) {
      const data = state.buffer.data
      const index = data.findIndex((item) => item.id = id)
      if (index !== -1) data.splice(index, 1)
    },
  }
}
