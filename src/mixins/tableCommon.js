/**
 * 业务管理 - 表单公用操作：请求数据、删除操作
 *
 * @author  huojinzhao
 *
 * @desc    在对应路由对象中设置meta.uri（取、删数据接口地址）
 * @desc    删除按钮的handler为toDeleteItem
 */

import { mapActions } from 'vuex'

export default {

  data: () => ({
    tableInfo: {},
  }),

  computed: {
    $_uri() {
      return this.$route.meta.uri
    },
  },

  methods: {
    ...mapActions('utils/listDeletion', {
      $_deleteListItem: 'preDeleteItem',
    }),

    // 请求数据，暴露给外部
    getData(queryUri) {
      return this.$http.get(`${this.$_uri}${queryUri}`)
        .then((res) => { this.tableInfo = res })
    },


    /**
     * 打开删除弹窗，保存成功回调
     *
     * @param   {Object}  list    -   目标列表
     * @param   {Object}  config  -   弹窗显示的配置信息
     */
    deleteItem(
      id,
      config = {},
      list = this.tableInfo.data,
    ) {
      const succeed = () => this.$_deletionSucceed(list, id)
      this.$_deleteListItem({ id, config, succeed })
    },

    /**
     * 查找删除table的列表中对应目标id的项，并删除
     *
     * @param   {Array}   list    -   目标列表信息的列表数据
     */
    $_deletionSucceed(list, id) {
      const index = list.findIndex(item => item.id === id)
      if (index > -1) this.$delete(list, index)
    },
  },
}
