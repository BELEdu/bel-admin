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

    [STUDENT.SCHEDULE.WEEKLY_LIST](state, list) {
      state.weekList = { ...list }
    },

    [STUDENT.SCHEDULE.DAILY_LIST](state, list) {
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
    [STUDENT.SCHEDULE.WEEKLY_LIST]({ commit }, query = '') {
      return Http.get(`/schedule/weekly/${query}`)
        .then((result) => {
          commit(STUDENT.SCHEDULE.WEEKLY_LIST, result)
        })
    },

    // 获取周课表列表数据
    [STUDENT.SCHEDULE.DAILY_LIST]({ commit }, query = '') {
      return Http.get(`/schedule/daily/${query}`)
        .then((result) => {
          commit(STUDENT.SCHEDULE.DAILY_LIST, result)
        })
    },
  },
}
