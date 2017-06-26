/**
 * 学员管理 - 预警信息 状态
 * @author zml
 * @version 2017-06-26
 */

import { Http } from '@/utils'
import { STUDENT } from '../mutationTypes'

export default {
  state: {
    // 列表数据
    list: {
      data: [],
    },
  },

  mutations: {
    // 预警信息列表
    [STUDENT.WARNING.INIT](state, list) {
      state.list = list
    },
  },

  actions: {
    // 预警信息列表接口(传入学生id和query)
    [STUDENT.WARNING.INIT]({ commit }, { id, query = '' }) {
      return Http.get(`/studentwarning/${id}${query}`)
       .then((res) => {
         commit(STUDENT.WARNING.INIT, res)
       })
    },
  },
}

