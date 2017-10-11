/**
 * 学员课程 - 学员管理 = 签约产品
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
    // 签约产品列表
    [STUDENT.STUDENT.PRODUCT.INIT](state, list) {
      state.list = list
    },
  },

  actions: {
    // 签约产品列表接口(传入学生id和query)
    [STUDENT.STUDENT.PRODUCT.INIT]({ commit }, { id, query = '' }) {
      return Http.get(`/student/stock/${id}${query}`)
        .then((res) => {
          commit(STUDENT.STUDENT.PRODUCT.INIT, res)
        })
    },
  },
}

