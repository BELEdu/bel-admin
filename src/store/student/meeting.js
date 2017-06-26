/**
 * 学员管理 - 交流会 状态
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
    // 交流会列表
    [STUDENT.MEETING.INIT](state, list) {
      state.list = list
    },
    // 删除交流会
    [STUDENT.MEETING.DELETE](state, id) {
      state.list.data = state.list.data
        .filter(item => item.id !== id)
    },
  },

  actions: {
    // 交流会列表接口(传入学生id和query)
    [STUDENT.MEETING.INIT]({ commit }, { id, query = '' }) {
      return Http.get(`/studentmeeting/${id}${query}`)
       .then((res) => {
         commit(STUDENT.MEETING.INIT, res)
       })
    },
    // 删除交流会接口
    [STUDENT.MEETING.DELETE]({ commit }, id) {
      return Http.delete(`/meeting/${id}`)
        .then(() => {
          commit(STUDENT.MEETING.DELETE, id)
        })
    },
  },
}

