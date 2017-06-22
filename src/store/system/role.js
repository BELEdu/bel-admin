import { Http } from '@/utils'
import { SYSTEM } from '../mutationTypes'

export default {
  state: {
    list: {
      data: [],
    },
    permis: {},
  },

  mutations: {
    [SYSTEM.ROLE.INIT](state, list) {
      state.list = list
    },

    [SYSTEM.ROLE.PERMIS.INIT](state, permis) {
      state.permis = permis
    },
  },

  actions: {
    [SYSTEM.ROLE.INIT]({ commit }, query = '') {
      return Http.get(`/role${query}`)
        .then(res => commit(SYSTEM.ROLE.INIT, res))
    },

    [SYSTEM.ROLE.PERMIS.INIT]({ commit }) {
      return Http.get('/role/create')
        .then(res => commit(SYSTEM.ROLE.PERMIS.INIT, res))
    },
  },
}
