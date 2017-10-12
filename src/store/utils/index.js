/**
 * 非模块状态管理
 *
 * @author  huojinzhao
 * @desc    用于管理非模块的状态，例如：列表删除弹窗组件
 */

import listDeletion from './listDeletion'

export default {
  namespaced: true,

  modules: {
    listDeletion,
  },
}

