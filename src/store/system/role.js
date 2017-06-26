import { Http } from '@/utils'
import { SYSTEM } from '../mutationTypes'

export default {
  state: {
    list: {
      data: [],
    },
  },

  mutations: {
    [SYSTEM.ROLE.INIT](state, list) {
      state.list = list
    },
  },

  actions: {
    [SYSTEM.ROLE.INIT]({ commit }, query = '') {
      return Http.get(`/role${query}`)
        .then(res => commit(SYSTEM.ROLE.INIT, res))
    },
  },
}
