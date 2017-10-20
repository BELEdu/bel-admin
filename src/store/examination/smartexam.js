/**
 * 测试管理 - 智能测试
 * @author zml
 * @version 2017-10-20
 */

import { Http } from '@/utils'
import { EXAMINATION } from '../mutationTypes'

export default {

  state: {
    // 测试列表
    list: {
      data: [],
    },
  },

  mutations: {
    // 测试列表
    [EXAMINATION.SMARTEXAM.INIT](state, list) {
      state.list = list
    },
    // 删除班级
    [EXAMINATION.SMARTEXAM.DELETE](state, id) {
      state.list.data = state.list.data
        .filter(item => item.id !== id)
    },
  },

  actions: {
    // 测试列表接口
    [EXAMINATION.SMARTEXAM.INIT]({ commit }, query = '') {
      return Http.get(`/test${query}`)
        .then((res) => {
          commit(EXAMINATION.SMARTEXAM.INIT, res)
        })
    },
    // 删除测试接口
    [EXAMINATION.SMARTEXAM.DELETE]({ commit }, id) {
      return Http.delete(`/test/${id}`)
        .then(() => {
          commit(EXAMINATION.SMARTEXAM.DELETE, id)
        })
    },
  },
}
