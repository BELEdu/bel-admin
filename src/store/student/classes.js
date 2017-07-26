/**
 * 学员管理 - 班级管理 状态
 * @author zml
 * @version 2017-06-20
 */

import { Http } from '@/utils'
import { STUDENT } from '../mutationTypes'

export default {

  state: {
    // 班级列表
    list: {
      data: [],
    },
  },

  mutations: {
    // 班级列表
    [STUDENT.CLASSES.INIT](state, list) {
      state.list = list
    },
    // 删除班级
    [STUDENT.CLASSES.DELETE](state, id) {
      state.list.data = state.list.data
        .filter(item => item.id !== id)
    },
  },

  actions: {
    // 班级列表接口
    [STUDENT.CLASSES.INIT]({ commit }, query = '') {
      return Http.get(`/classes${query}`)
        .then((res) => {
          commit(STUDENT.CLASSES.INIT, res)
        })
    },
    // 删除班级接口
    [STUDENT.CLASSES.DELETE]({ commit }, id) {
      return Http.delete(`/classes/${id}`)
        .then(() => {
          commit(STUDENT.CLASSES.DELETE, id)
        })
    },
  },
}
