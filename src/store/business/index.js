/**
 * 业务管理状态
 * @author hjz
 * @version 2017-06-08
 */

import { Http } from '@/utils'
import { BUSINESS } from '../mutationTypes'
import editOrigin from './editOrigin'

export default {
  state: {
    buffer: null,
    unit: null,
    uri: '',
  },

  actions: {
    // index 初始化
    [BUSINESS.PAGE.INIT]({ state, commit }, to) {
      commit(BUSINESS.SETURI, to.meta.uri)
      const index = to.fullPath.indexOf('?')
      if (index === -1) {
        return Http.get(`/${state.uri}`)
          .then(res => commit(BUSINESS.PAGE.INIT, res))
      }
      const query = to.fullPath.substr(index)
      return Http.get(`/${state.uri}${query}`)
        .then(res => commit(BUSINESS.PAGE.INIT, res))
    },
    // 编辑页面 初始化
    [BUSINESS.EDIT.INIT]({ state, commit }, id) {
      if (id) {
        return Http.get(`/${state.uri}/${id}`).then(res => commit(BUSINESS.EDIT.INIT, res))
      }
      return commit(BUSINESS.EDIT.INIT)
    },
    // 编辑页面 提交添加信息
    [BUSINESS.EDIT.CREATE]({ state, commit }, payload) {
      // 提交成功后回到index组件
      return Http.post(`/${state.uri}`, payload)
        .then(() => commit(BUSINESS.EDIT.CREATE))
      // .then(() => dispatch(BUSINESS.PAGE.INIT))
    },
    // 编辑页面 提交修改信息
    [BUSINESS.EDIT.UPDATE]({ state, commit }, payload) {
      // 提交成功后回到index组件
      return Http.patch(`/${state.uri}/${payload.id}`, payload.fdata)
        .then(() => commit(BUSINESS.EDIT.UPDATE))
    },
    // index页面 删除信息
    [BUSINESS.EDIT.DELETE]({ state, commit }, id) {
      return Http.delete(`/${state.uri}/${id}`).then(() => commit(BUSINESS.EDIT.DELETE, id))
    },
  },

  mutations: {
    [BUSINESS.PAGE.INIT](state, res) {
      // res是否要做处理
      state.buffer = res
    },
    // 在router的钩子中使用
    [BUSINESS.SETURI](state, uri) {
      state.uri = uri
    },
    [BUSINESS.EDIT.INIT](state, payload) {
      if (payload) state.unit = payload
      else state.unit = editOrigin[state.uri]
    },
    // 暂时不用commit(BUSINESS.EDIT.CREATE | BUSINESS.EDIT.UPDATE)，提交成功之后回到第一页（并重新发送第一页数据请求）
    [BUSINESS.EDIT.CREATE](state) {
      state.unit = null
    },
    [BUSINESS.EDIT.UPDATE](state) {
      state.unit = null
    },
    [BUSINESS.EDIT.DELETE](state, id) {
      const data = state.buffer.data
      const index = data.findIndex(item => item.id === id)
      if (index !== -1) data.splice(index, 1)
    },
  },
}
