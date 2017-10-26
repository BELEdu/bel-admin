/**
 * 备课管理 - 教案管理
 * @author zml
 * @version 2017-10-20
 */

import { Http } from '@/utils'
import { PREPARE } from '../mutationTypes'

export default {

  state: {
    // 教师列表
    teachers: {
      data: [],
    },
    // 教案列表
    plans: {
      data: [],
    },
    // 教师姓名
    teachername: '',
  },

  mutations: {
    // 教师列表
    [PREPARE.PREPAREPLAN.INIT](state, teachers) {
      state.teachers = teachers
    },
    // 教案列表
    [PREPARE.PREPAREPLAN.DETAIL.INIT](state, plans) {
      state.plans = plans
    },
    // 获取教师姓名
    [PREPARE.PREPAREPLAN.TEACHERNAME](state, teachername) {
      state.teachername = teachername
    },
  },

  actions: {
    // 教师列表接口
    [PREPARE.PREPAREPLAN.INIT]({ commit }, query = '') {
      return Http.get(`/scheme${query}`)
        .then((res) => {
          commit(PREPARE.PREPAREPLAN.INIT, res)
        })
    },
    // 教案列表接口
    [PREPARE.PREPAREPLAN.DETAIL.INIT]({ commit }, { id, query = '' }) {
      return Http.get(`/scheme/${id}${query}`)
        .then((res) => {
          commit(PREPARE.PREPAREPLAN.DETAIL.INIT, res)
        })
    },
  },
}
