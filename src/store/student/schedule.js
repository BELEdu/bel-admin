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

    weekList: {
      head: [],
      data: [],
    },

    dayList: {
      data: [],
    },

  },

  mutations: {
    [STUDENT.SCHEDULE.LIST](state, list) {
      state.list = { ...list }
    },

    [STUDENT.SCHEDULE.WEEK_LIST](state, list) {
      state.weekList = { ...list }
    },

    [STUDENT.SCHEDULE.DAY_LIST](state, list) {
      state.dayList = { ...list }
    },
  },

  actions: {
    // 获取列表数据
    [STUDENT.SCHEDULE.LIST]({ commit }, query = '') {
      return Http.get(`/schedule${query}`)
        .then((result) => {
          commit(STUDENT.SCHEDULE.LIST, result)
        })
    },

    // 获取周课表列表数据
    [STUDENT.SCHEDULE.WEEK_LIST]({ commit }, query = '') {
      return Http.get(`/schedule/weekly/${query}`)
        .then((result) => {
          commit(STUDENT.SCHEDULE.WEEK_LIST, {
            head: Object.keys(result),
            data: Object.values(result),
          })
        })
    },
  },
}
