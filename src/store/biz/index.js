/**
 * 业务管理状态
 * @author hjz
 * @version 2017-06-08
 */

/* eslint-disable */
import { Http } from '@/utils'
import { BIZ } from '../mutationTypes'
import edit from './data'
// import router from '@/src/router'
// import store from '@/src/store'

const encode = function(data) {
  let ectype = { ...data }
  if(typeof ectype.visited_at === 'object')   ectype.visited_at = ectype.visited_at.toJSON().slice(0,10)
  if(typeof ectype.return_visited_at === 'object') ectype.return_visited_at = ectype.return_visited_at.toJSON().slice(0,10)
  // 地址map编码
  return ectype
}


export default {
  state: {
    buffer: null,
    unit: null,
    routeType: '',
  },

  getters: {
    // hotline \ comm \ contract \ product
    // return { init: | create: | update: 更新数据后端api | delete: | edit: 获取item详细信息api }
    // 使用restful接口，让routeType = api即可
    // bizApi(state) {
    //   switch(state.routeType) { ... }
    // },
  },

  actions: {
    // index 初始化 
    [BIZ.INIT]({ state, commit }, to) {
      // const path = to.path
      const page = to.query.page ? to.query.page : 1
      const per_page = to.query.per_page ? to.query.per_page : 10
      return Http.get(`/${state.routeType}?page=${page}&&?per_page=${per_page}`)
        .then(res => commit(BIZ.INIT, res))
    },
    // 编辑页面 初始化
    [BIZ.EDIT]({ state, commit }, id) {
      if (id) return Http.get(`/${state.routeType}/${id}`).then(res => commit(BIZ.EDIT, res))
      else commit(BIZ.EDIT)
    },
    // 编辑页面 提交添加信息
    [BIZ.CREATE]({ state, commit }, payload) {
      // 提交成功后回到index组件
      return Http.post(`/${state.routeType}`, encode(payload))
        .then(() => commit(BIZ.CREATE))
        // .then(() => dispatch(BIZ.INIT))
    },
    // 编辑页面 提交修改信息
    [BIZ.UPDATE]({ state, commit }, payload) {
      // 提交成功后回到index组件
      return Http.patch(`/${state.routeType}/${payload.id}`, encode(payload.fdata))
        // .then(() => commit(BIZ.UPDATE))
        .then(() => window.console.log('成功'))
        .catch(() => window.console.log('失败'))
    },
    // index页面 删除信息
    [BIZ.DELETE]({ commit }, id) {
      return Http.delete(`/${state.routeType}/${id}`).then(() => commit(BIZ.DELETE, id))
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
      else state.unit = edit[state.routeType]
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
