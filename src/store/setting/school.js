/**
 * 学校管理
 * @author chenliangshan
 * @version 2017-10-12
 */

import { Http } from '@/utils'
import { SETTING } from '../mutationTypes'

export default {
  state: {
    list: {
      data: [],
    },
  },

  mutations: {
    [SETTING.SCHOOL.LIST](state, list = {}) {
      state.list = { ...list }
    },
  },

  actions: {
    [SETTING.SCHOOL.LIST]({ commit }, query = '') {
      return Http.get(`/setting/school${query}`)
        .then((result) => {
          commit(SETTING.SCHOOL.LIST, result)
          return result
        })
    },
  },
}
