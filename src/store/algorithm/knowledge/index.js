/**
 * 算法中心 - 知识点
 *
 * @author huojinzhao
 */

const reuseModule = {
  namespaced: true,

  state: () => ({
    history: '',
  }),

  mutations: {
    recordHistory(state, url) {
      state.history = url
    },
  },
}

export default {
  namespaced: true,

  modules: {
    show: reuseModule,
    detail: reuseModule,
  },
}
