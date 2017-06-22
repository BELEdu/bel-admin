import { Http } from '@/utils'
import { SYSTEM } from '../mutationTypes'

export default {
  state: {
    list: {
      data: [],
    },
  },

  mutations: {
    [SYSTEM.USER.INIT](state, list) {
      state.list = list
    },
  },

  actions: {
    [SYSTEM.USER.INIT]({ commit }, query = '') {
      return Http.get(`/user/${query}`)
        .then(res => commit(SYSTEM.USER.INIT, res))
    },
  },
}
