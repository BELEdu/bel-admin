/**
 * 业务管理 - 预约记录
 * @author zml
 * @version 2017-01-18
 */

import { Http } from '@/utils'
import { BUSINESS } from '../mutationTypes'

export default {

  state: {
    // 预约列表
    list: {
      data: [],
    },

  },

  mutations: {
    // 预约列表
    [BUSINESS.RESERVATION.INIT](state, list) {
      state.list = list
    },
  },

  actions: {
    // 测试列表接口
    [BUSINESS.RESERVATION.INIT]({ commit }, query = '') {
      return Http.get(`/reservation${query}`)
        .then((res) => {
          commit(BUSINESS.RESERVATION.INIT, res)
        })
    },
  },
}
