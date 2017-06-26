import { Http } from '@/utils'
import { SYSTEM } from '../mutationTypes'

export default {
  state: {
    list: [],
  },

  getters: {
    departments(state) {
      // 这里代码有点丑，待优化
      const flat = (items, array, level) => {
        // eslint-disable-next-line
        level++
        items.forEach((item) => {
          if (item.children) {
            array.push({ ...item, level, children: true })
            flat(item.children, array, level)
          } else {
            array.push({ ...item, level })
          }
        })
        return array
      }

      return flat(state.list, [], 0)
    },
  },

  mutations: {
    // 读取部门
    [SYSTEM.DEPARTMENT.INIT](state, list) {
      state.list = list
    },

    // 更新部门（更名）
    [SYSTEM.DEPARTMENT.UPDATE](state, { id, display_name }) {
      state.list = state.list
        .map((item) => {
          if (item.id === id) {
            return { ...item, display_name }
          }
          return item
        })
    },

    // 删除部门
    [SYSTEM.DEPARTMENT.DELETE](state, id) {
      state.list = state.list
        .filter(item => item.id !== id)
    },
  },

  actions: {
    // 读取部门
    [SYSTEM.DEPARTMENT.INIT]({ commit }) {
      return Http.get('/department')
        .then((res) => {
          commit(SYSTEM.DEPARTMENT.INIT, res)
        })
    },

    // 新增部门（新增后应重新读取部门列表）
    [SYSTEM.DEPARTMENT.CREATE]({ dispatch }, data) {
      return Http.post('/department', data)
        .then(() => dispatch(SYSTEM.DEPARTMENT.INIT))
    },

    // 更新部门（更名）
    [SYSTEM.DEPARTMENT.UPDATE]({ commit }, { id, data }) {
      return Http.patch(`/department/${id}`, data)
        .then(() => {
          const { display_name } = data
          commit(SYSTEM.DEPARTMENT.UPDATE, { id, display_name })
        })
    },

    // 删除部门
    [SYSTEM.DEPARTMENT.DELETE]({ commit }, id) {
      return Http.delete(`/department/${id}`)
        .then(() => {
          commit(SYSTEM.DEPARTMENT.DELETE, id)
        })
    },
  },
}
