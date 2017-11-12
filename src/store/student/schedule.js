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

    dailyList: {
      data: [],
    },

    // 未完成课时数
    tip: {
      ready_courses: 0,
    },

    // 当前编辑的课表
    currentCourseItem: {},

    // 当前班级章节数据
    currentChapter: [],

  },

  mutations: {
    [STUDENT.SCHEDULE.LIST](state, list) {
      state.list = { ...list }
    },

    [STUDENT.SCHEDULE.WEEKLY_LIST](state, list) {
      state.weekList = { ...list }
    },

    [STUDENT.SCHEDULE.DAILY_LIST](state, list) {
      state.dailyList = { ...list }
    },

    [STUDENT.SCHEDULE.GET_TIP](state, data) {
      state.tip = { ...data }
    },

    [STUDENT.SCHEDULE.COURSE_ITEM](state, item) {
      state.currentCourseItem = item
    },

    [STUDENT.SCHEDULE.COURSE_ITEM_CHAPTER](state, chapterTree) {
      state.currentChapter = chapterTree
    },
  },

  actions: {
    // 获取列表数据
    [STUDENT.SCHEDULE.LIST]({ commit }, query = '') {
      return Http.get(`/schedule${query}`)
        .then((result) => {
          commit(STUDENT.SCHEDULE.LIST, result)
          return result
        })
    },

    // 获取周课表列表数据
    [STUDENT.SCHEDULE.WEEKLY_LIST]({ commit }, query = '') {
      return Http.get(`/schedule/weekly/${query}`)
        .then((result) => {
          commit(STUDENT.SCHEDULE.WEEKLY_LIST, result)
          return result
        })
    },

    // 获取周课表列表数据
    [STUDENT.SCHEDULE.DAILY_LIST]({ commit }, query = '') {
      return Http.get(`/schedule/daily/${query}`)
        .then((result) => {
          commit(STUDENT.SCHEDULE.DAILY_LIST, result)
          return result
        })
    },

    // 获取教师未完成课时数
    [STUDENT.SCHEDULE.GET_TIP]({ commit }, query = '') {
      return Http.get(`/schedule/tip/${query}`)
        .then((result) => {
          commit(STUDENT.SCHEDULE.GET_TIP, result)
          return result
        })
    },

    // 获取当前班级数据源
    [STUDENT.SCHEDULE.COURSE_ITEM_CHAPTER]({ commit }, { classes_id }) {
      return Http.get(`/plan/store_before/${classes_id}`)
        .then((result) => {
          commit(STUDENT.SCHEDULE.COURSE_ITEM_CHAPTER, result.chapterTree)
          return result
        })
    },
  },
}
