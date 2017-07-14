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

    [SYSTEM.USER.DELETE](state, id) {
      state.list.data = state.list.data.filter(user => user.id !== id)
    },
  },

  actions: {
    [SYSTEM.USER.INIT]({ commit }, query = '') {
      return Http.get(`/user/${query}`)
        .then(res => commit(SYSTEM.USER.INIT, res))
    },

    [SYSTEM.USER.DELETE]({ commit }, { id, CheckoutPassword }) {
      return Http.delete(`/user/${id}`, { CheckoutPassword })
        .then(() => commit(SYSTEM.USER.DELETE, id))
    },
  },
}
