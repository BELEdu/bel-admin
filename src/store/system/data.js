/**
 * 系统管理模块某些表单所需的额外数据
 * @author lmh
 * @version 2017-06-30
 */

import { Http } from '@/utils'
import { transform, generatePaths } from '@/utils/helpers'
import { SYSTEM } from '../mutationTypes'

export default {
  state: {
    departments: [],
    data_auths: [],
    permissions: [],
    departmentPaths: [],

    roles: [],
    rolePaths: [],
  },

  mutations: {
    [SYSTEM.DATA.PERMIS.INIT](state, { departments, data_auths, permissions }) {
      state.departments = transform(departments)
      state.data_auths = data_auths
      state.permissions = permissions
      state.departmentPaths = generatePaths(departments)
    },

    [SYSTEM.DATA.ROLES.INIT](state, roles) {
      state.roles = transform(roles)
      state.rolePaths = generatePaths(roles)
    },
  },

  actions: {
    [SYSTEM.DATA.PERMIS.INIT]({ state, commit }) {
      // 减少接口请求，如已有数据不再请求
      if (state.departmentPaths.length === 0) {
        return Http.get('/role/create')
          .then(res => commit(SYSTEM.DATA.PERMIS.INIT, res))
      }
      return Promise.resolve()
    },

    [SYSTEM.DATA.ROLES.INIT]({ state, commit }) {
      // 减少接口请求，如已有数据不再请求
      if (state.rolePaths.length === 0) {
        return Http.get('/department_role')
          .then(res => commit(SYSTEM.DATA.ROLES.INIT, res))
      }
      return Promise.resolve()
    },
  },
}
