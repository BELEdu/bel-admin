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

    courseNum: 8,

    multiTeacher: false,

    currentItem: {
      data: {},
      type: 'add',
      teacher: [],
      courseList: [],
      isNightCoach: false,
    },

    currentChapter: [],

    // TODO mock可用课时
    courseRemain: 100,
  },

  mutations: {
    [STUDENT.PLAN.INIT](state, list) {
      state.list = {
        ...list,
      }
    },

    [STUDENT.PLAN.UPDATE](state, update) {
      state.list = state.list.map((item) => {
        if (item.id === update.id) {
          return {
            ...item,
            ...update,
          }
        }
        return item
      })
    },

    [STUDENT.PLAN.CURRENT_ITEM_DATA](state, item) {
      state.currentItem.data = {
        ...item,
      }
      state.currentItem.isNightCoach = item.coach_type === 2
    },

    [STUDENT.PLAN.CURRENT_ITEM_TYPE](state, type) {
      state.currentItem.type = type
    },

    [STUDENT.PLAN.CURRENT_ITEM_TEACHER](state, list) {
      state.currentItem.teacher = list
    },

    [STUDENT.PLAN.CURRENT_ITEM_COURSELIST](state, list) {
      state.currentItem.courseList = list
    },

    [STUDENT.PLAN.CURRENT_CHAPTER](state, list) {
      state.currentChapter = list
    },

    [STUDENT.PLAN.UPDATE_FIELD](state, field) {
      state = { ...state, field }
    },
  },

  actions: {
    [STUDENT.PLAN.INIT]({ commit }, query = '') {
      return Http.get(`/plan${query}`)
        .then((result) => {
          commit(STUDENT.PLAN.INIT, result)
        })
    },

    [STUDENT.PLAN.CURRENT_ITEM_TEACHER]({ commit }, query = '') {
      return Http.get(`/teacher_list${query}`)
        .then((result) => {
          commit(STUDENT.PLAN.CURRENT_ITEM_TEACHER, result)
        })
    },

    [STUDENT.PLAN.CURRENT_CHAPTER]({ commit }, query = '') {
      return Http.get(`/chapter/tree/3${query}`)
        .then((result) => {
          commit(STUDENT.PLAN.CURRENT_CHAPTER, result)
        })
    },

    // 获取计划详情
    [STUDENT.PLAN.FETCH_COACH_LIST]({ commit, state }) {
      return Http.get(`/plan/${state.currentItem.data.id}`)
        .then((result) => {
          commit(STUDENT.PLAN.CURRENT_ITEM_COURSELIST, result.course)
        })
    },
  },
}
