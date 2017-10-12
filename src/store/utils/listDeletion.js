/**
 * 公共组件 - TheListDeletion
 *
 * @author  huojinzhao
 * @desc    列表页的删除事务
 */

export default {
  namespaced: true,

  state: {
    control: {
      visible: false,
      confirmLoading: false,
    },

    view: {
      title: '确认删除',
      message: '删除该条记录后将无法再恢复，是否继续删除？',
    },

    buffer: {
      id: null,
      succeed: () => null,
    },
  },

  mutations: {
    $_launchSucceed(state, { id, succeed }) {
      state.buffer = { id, succeed }
    },

    $_openWarn(state, config) {
      state.view = {
        ...state.view,
        ...config,
      }
      state.control.visible = true
    },

    closeWarn(state) {
      state.control = {
        visible: false,
        confirmLoading: false,
      }
    },

    $_onLoading(state) {
      state.control.confirmLoading = true
    },
  },

  actions: {
    /**
     * 点击列表删除按钮，打开提醒弹窗，保存成功回调
     *
     * @param   {number}    列表中删除项的id
     * @param   {Object}    删除框显示的配置
     * @param   {function}  删除成功后的执行函数
     *
     * @desc    mixins/tableCommon中调用
     */
    preDeleteItem({ commit }, { id, config, succeed }) {
      // 保存成功回调
      commit('$_launchSucceed', { id, succeed })
      // 打开弹窗
      commit('$_openWarn', config)
    },

    /**
     * 点击弹窗确认删除
     *
     * @param   {String}  执行删除的异步函数
     *
     * @desc    components/TheListDeletion中调用
     */
    deleteItem(
      { commit, state },
      { request, requestError },
    ) {
      // 开启loading
      commit('$_onLoading')
      // 执行异步删除
      request(state.buffer.id)
        .then(() => state.buffer.succeed())
        .catch(error => requestError(error))
        .then(() => commit('closeWarn'))
    },
  },
}
