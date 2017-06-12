/**
 * 系统管理状态
 * @author lmh
 * @version 2017-06-06
 */

import { Http } from '@/utils'
import { SYSTEM } from '../mutationTypes'

export default {
  state: {
    departments: [],
  },

  mutations: {
    // 读取部门
    [SYSTEM.DEPARTMENT.READ](state, departments) {
      state.departments = departments
    },

    // 更新部门（更名）
    [SYSTEM.DEPARTMENT.UPDATE](state, { id, display_name }) {
      state.departments = state.departments
        .map((department) => {
          if (department.id === id) {
            return { ...department, display_name }
          }
          return department
        })
    },

    // 删除部门
    [SYSTEM.DEPARTMENT.REMOVE](state, id) {
      state.departments = state.departments
        .filter(department => department.id !== id)
    },
  },

  actions: {
    // 读取部门
    [SYSTEM.DEPARTMENT.READ]({ commit }) {
      return Http.get('/department')
        .then((res) => {
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

          const departments = flat(res, [], 0)

          commit(SYSTEM.DEPARTMENT.READ, departments)
        })
    },

    // 新增部门（新增后应重新读取部门列表）
    [SYSTEM.DEPARTMENT.CREATE]({ dispatch }, data) {
      return Http.post('/department', data)
        .then(() => dispatch(SYSTEM.DEPARTMENT.READ))
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
    [SYSTEM.DEPARTMENT.REMOVE]({ commit }, id) {
      return Http.delete(`/department/${id}`)
        .then(() => {
          commit(SYSTEM.DEPARTMENT.REMOVE, id)
        })
    },
  },
}
