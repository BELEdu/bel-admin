/**
 * 学员管理 - 学员信息 状态
 * @author zml
 * @version 2017-06-22
 */
import { Http } from '@/utils'
import { STUDENT } from '../mutationTypes'

export default {
  state: {
    // 学员列表
    list: {
      data: [],
    },
  },

  mutations: {
    // 学员列表
    [STUDENT.STUDENT.INIT](state, list) {
      state.list = list
    },
    // 删除学员
    [STUDENT.STUDENT.DELETE](state, id) {
      state.list.data = state.list.data
        .filter(item => item.id !== id)
    },
  },

  actions: {
    // 学员列表接口
    [STUDENT.STUDENT.INIT]({ commit }, query = '') {
      return Http.get(`/student${query}`)
        .then((res) => {
          commit(STUDENT.STUDENT.INIT, res)
        })
    },
    // 删除学员接口
    [STUDENT.STUDENT.DELETE]({ commit }, id) {
      return Http.delete(`/student/${id}`)
        .then(() => {
          commit(STUDENT.STUDENT.DELETE, id)
        })
    },
  },

}

