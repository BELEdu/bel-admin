import { Http } from '@/utils'
import { SYSTEM } from '../mutationTypes'

export default {
  state: {
    departments: [],
  },

  mutations: {
    // 读取部门
    [SYSTEM.DEPARTMENT.INIT](state, departments) {
      state.departments = departments
    },
  },

  actions: {
    // 读取部门
    [SYSTEM.DEPARTMENT.INIT]({ commit }) {
      return Http.get('/department')
        .then(res => commit(SYSTEM.DEPARTMENT.INIT, res))
    },

    // 新增部门
    [SYSTEM.DEPARTMENT.CREATE]({ dispatch }, { data, CheckoutPassword }) {
      return Http.post('/department', data, { CheckoutPassword })
        .then(() => dispatch(SYSTEM.DEPARTMENT.INIT))
    },

    // 更新部门（更名）
    [SYSTEM.DEPARTMENT.UPDATE]({ dispatch }, { id, data }) {
      return Http.patch(`/department/${id}`, data)
        .then(() => dispatch(SYSTEM.DEPARTMENT.INIT))
    },

    // 删除部门
    [SYSTEM.DEPARTMENT.DELETE]({ dispatch }, { id, CheckoutPassword }) {
      return Http.delete(`/department/${id}`, { CheckoutPassword })
        .then(() => dispatch(SYSTEM.DEPARTMENT.INIT))
    },
  },
}
