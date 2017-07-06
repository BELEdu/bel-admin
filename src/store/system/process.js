import { Http } from '@/utils'
import { SYSTEM } from '../mutationTypes'

export default {
  state: {
    list: {
      data: [],
    },
  },

  mutations: {
    [SYSTEM.PROCESS.INIT](state, list) {
      state.list = list
    },

    [SYSTEM.PROCESS.DELETE](state, id) {
      state.list.data = state.list.data
        .filter(item => item.id !== id)
    },
  },

  actions: {
    [SYSTEM.PROCESS.INIT]({ commit }, query = '') {
      return Http.get(`/process${query}`)
        .then(res => commit(SYSTEM.PROCESS.INIT, res))
    },

    [SYSTEM.PROCESS.DELETE]({ commit }, id) {
      return Http.delete(`/process/${id}`)
        .then(() => commit(SYSTEM.PROCESS.DELETE, id))
    },
  },
}
