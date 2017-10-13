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
    currentItemData: {},
    currentItemType: 'add',
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
      state.currentItemData = {
        ...item,
      }
    },

    [STUDENT.PLAN.CURRENT_ITEM_TYPE](state, type) {
      state.currentItemType = type
    },
  },

  actions: {
    [STUDENT.PLAN.INIT]({ commit }, query = '') {
      return Http.get(`/plan${query}`)
        .then((result) => {
          commit(STUDENT.PLAN.INIT, result)
        })
    },
  },
}
