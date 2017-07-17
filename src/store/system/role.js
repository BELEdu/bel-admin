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

    [SYSTEM.ROLE.DELETE](state, id) {
      state.list.data = state.list.data.filter(role => role.id !== id)
    },
  },

  actions: {
    [SYSTEM.ROLE.INIT]({ commit }, query = '') {
      return Http.get(`/role${query}`)
        .then(res => commit(SYSTEM.ROLE.INIT, res))
    },

    [SYSTEM.ROLE.DELETE]({ commit }, { id, CheckoutPassword }) {
      return Http.delete(`/role/${id}`, { CheckoutPassword })
        .then(() => commit(SYSTEM.ROLE.DELETE, id))
    },
  },
}
