/**
 * 学习计划
 * @author chenliangshan
 * @version 2017-10-12
 */

import { Http } from '@/utils'
import { STUDENT } from '../mutationTypes'

export default {
  state: {
    list: {
      data: [],
    },
  },

  mutations: {
    [STUDENT.PLAN.INIT](state, list) {
      state.list = {
        ...state.list,
        ...list,
      }
    },
  },

  actions: {
    [STUDENT.PLAN.INIT]({ commit }, query = '') {
      return Http.get(`/plan${query}`)
        .then((result) => {
          commit(STUDENT.PLAN.INIT, result)
        })
    },
  },
}
