/**
 * 题库中心 - 报告配置
 * @author zml
 * @version 2017-11-15
 */

import { Http } from '@/utils'
import { QUESTION } from '../mutationTypes'

export default {

  state: {
    // 配置列表
    list: {
      data: [],
    },
  },

  mutations: {
    // 配置列表
    [QUESTION.REPORT.INIT](state, list) {
      state.list = list
    },

    // 删除配置
    [QUESTION.REPORT.DELETE](state, id) {
      state.list.data = state.list.data
        .filter(item => item.id !== id)
    },
  },

  actions: {
    // 配置列表接口
    [QUESTION.REPORT.INIT]({ commit }, { qs = '', id }) {
      return Http.get(`/paper/${id}/refer${qs}`)
        .then((res) => {
          commit(QUESTION.REPORT.INIT, res)
        })
    },
    // 删除配置接口
    [QUESTION.REPORT.DELETE]({ commit }, { id, remarkId }) {
      return Http.delete(`/paper/${id}/refer/${remarkId}`)
        .then(() => {
          commit(QUESTION.REPORT.DELETE, remarkId)
        })
    },
  },
}
