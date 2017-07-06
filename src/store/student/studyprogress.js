/**
 * 学员管理 - 学习进度 状态
 * @author zml
 * @version 2017-07-06
 */
import { Http } from '@/utils'
import { STUDENT } from '../mutationTypes'

export default {
  state: {
    // 进度列表
    list: {
      data: [],
    },
  },

  mutations: {
    // 学员进度列表
    [STUDENT.STUDYPROGRESS.STUDENT.INIT](state, list) {
      state.list = list
    },
    // 班级进度列表
    [STUDENT.STUDYPROGRESS.CLASSES.INIT](state, list) {
      state.list = list
    },
    // 学员历史计划列表
    [STUDENT.STUDYPROGRESS.STUDENT.HISTORY.INIT](state, list) {
      state.list = list
    },
    // 班级历史计划列表
    [STUDENT.STUDYPROGRESS.CLASSES.HISTORY.INIT](state, list) {
      state.list = list
    },
  },

  actions: {
    // 学员进度列表接口
    [STUDENT.STUDYPROGRESS.STUDENT.INIT]({ commit }, query = '') {
      return Http.get(`/studentprogress${query}`)
        .then((res) => {
          commit(STUDENT.STUDYPROGRESS.STUDENT.INIT, res)
        })
    },
    // 班级进度列表接口
    [STUDENT.STUDYPROGRESS.CLASSES.INIT]({ commit }, query = '') {
      return Http.get(`/classesprogress${query}`)
        .then((res) => {
          commit(STUDENT.STUDYPROGRESS.CLASSES.INIT, res)
        })
    },
    // 学员历史计划列表接口
    [STUDENT.STUDYPROGRESS.STUDENT.HISTORY.INIT]({ commit }, { id, query = '' }) {
      return Http.get(`/studentplan/${id}${query}`)
        .then((res) => {
          commit(STUDENT.STUDYPROGRESS.STUDENT.HISTORY.INIT, res)
        })
    },
    // 班级历史计划列表接口
    [STUDENT.STUDYPROGRESS.CLASSES.HISTORY.INIT]({ commit }, { id, query = '' }) {
      return Http.get(`/classesplan/${id}${query}`)
        .then((res) => {
          commit(STUDENT.STUDYPROGRESS.CLASSES.HISTORY.INIT, res)
        })
    },

  },

}

