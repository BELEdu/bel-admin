/*
 * 操作记录上次操作行为数据
 * @Author: chenliangshan
 * @Date: 2017-12-06 19:23:31
 * @Last Modified by: chenliangshan
 * @Last Modified time: 2017-12-06 21:24:34
 */

import { mapState } from 'vuex'
import { GLOBAL } from '@/store/mutationTypes'

export default {

  computed: {
    ...mapState({
      lastRecord: state => state.lastRecord,
    }),
  },

  methods: {
    // 设置默认行为数据
    setLastRecord(key, val = null) {
      if (val) {
        this.$store.commit(GLOBAL.LASTRECORD, { [key]: val })
      }
    },
    // 获取默认行为数据
    getLastRecord(key, val = null) {
      return this.lastRecord[key] || val
    },
  },
}
