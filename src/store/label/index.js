/**
 * 用户 - 管理收藏标签 状态
 * @author zml
 * @version 2017-09-11
 */

import { Http } from '@/utils'
import { LABEL } from '../mutationTypes'

export default {

  state: {
    // 用户标签列表
    list: [],
  },

  mutations: {
    // 用户标签列表
    [LABEL.INIT](state, list) {
      state.list = list
    },
    // 添加用户标签
    [LABEL.CREATE](state, item) {
      state.list.push(item)
    },
    // 删除用户标签
    [LABEL.DELETE](state, id) {
      state.list = state.list
        .filter(item => item.id !== id)
    },
  },

  actions: {
    // 用户标签列表接口
    [LABEL.INIT]({ commit }) {
      return Http.get('/oa/user_label')
        .then((res) => {
          commit(LABEL.INIT, res)
        })
    },
    // 添加用户标签接口
    [LABEL.CREATE]({ commit }, form) {
      return Http.post('/user_label', form)
        .then((result) => {
          commit(LABEL.CREATE, result)
        })
    },
    // 删除用户标签接口
    [LABEL.DELETE]({ commit }, id) {
      return Http.delete(`/user_label/${id}`)
        .then(() => {
          commit(LABEL.DELETE, id)
        })
    },
  },
}
