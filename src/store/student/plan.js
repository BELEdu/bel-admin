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

    currentItem: {
      data: {},
      type: 'add',
      teacher: [],
      courseList: [],
      isNightCoach: false,
      chapter: [],
      courseRemain: 0,
    },
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
      state.currentItem.isNightCoach = item.product_type === 5
    },

    [STUDENT.PLAN.CURRENT_ITEM_TYPE](state, type) {
      state.currentItem.type = type
    },

    [STUDENT.PLAN.CURRENT_ITEM_COURSELIST](state, list) {
      state.currentItem.courseList = list
    },

    [STUDENT.PLAN.CURRENT_ITEM_UPDATE](state, field) {
      state.currentItem = { ...state.currentItem, ...field }
    },
  },

  actions: {
    [STUDENT.PLAN.INIT]({ commit }, query = '') {
      return Http.get(`/plan${query}`)
        .then((result) => {
          commit(STUDENT.PLAN.INIT, result)
        })
    },

    [STUDENT.PLAN.CURRENT_ITEM_STORE]({ commit }, query = '') {
      return Http.get(`/plan/store_before/${query}`)
        .then(({ mini, chapterTree, teacher }) => {
          commit(STUDENT.PLAN.CURRENT_ITEM_UPDATE, {
            teacher: [...teacher],
            chapter: [...chapterTree],
            courseRemain: mini || 0,
          })
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
