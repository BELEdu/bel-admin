/**
 * 学员管理 - 学员知识点 状态
 * @author zml
 * @version 2017-07-26
 */

import { Http } from '@/utils'
import { STUDENT } from '../mutationTypes'

export default {

  state: {
    // 学员知识点列表
    list: {
      data: [],
    },
  },

  mutations: {
    [STUDENT.KNOWLEDGEPOINT.INIT](state, list) {
      state.list = list
    },
  },

  actions: {
    [STUDENT.KNOWLEDGEPOINT.INIT]({ commit }, query = '') {
      return Http.get(`/studentprogress${query}`)
        .then((res) => {
          commit(STUDENT.KNOWLEDGEPOINT.INIT, res)
        })
    },
  },

}
