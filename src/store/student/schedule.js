/**
 * 学员课程 - 课表
 * @author chenliangshan
 * @version 2017-10-19
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
    [STUDENT.SCHEDULE.LIST](state, list) {
      state.list = { ...list }
    },
  },

  actions: {
    // 获取列表数据
    [STUDENT.SCHEDULE.LIST]({ commit, query = '' }) {
      return Http.get(`/schedule${query}`)
        .then((result) => {
          commit(STUDENT.SCHEDULE.LIST, result)
        })
    },
  },
}
