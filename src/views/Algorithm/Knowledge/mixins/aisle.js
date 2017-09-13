/**
 * 算法中心 - 统计列表和明细列表切换
 *
 * @author huojinzhao
 */

import { mapState, mapMutations } from 'vuex'

export default {
  data: () => ({
    /* --- 搜索 --- */

    likeKeys: [
      {
        field_name: 'student_number',
        display_name: '知识点编号',
      },
      {
        field_name: 'student_name',
        display_name: '知识点名称',
      },
    ],

    likeKey: 'student_number',
  }),

  computed: {
    ...mapState('algorithm/knowledge/show', {
      showHistory: 'history',
    }),

    ...mapState('algorithm/knowledge/detail', {
      detailHistory: 'history',
    }),
  },

  methods: {
    ...mapMutations('algorithm/knowledge/show', {
      showRecord: 'recordHistory',
    }),

    ...mapMutations('algorithm/knowledge/detail', {
      detailRecord: 'recordHistory',
    }),

    getData(query, to) {
      return this.$http.get(to.fullPath)
        .then((res) => { this.buffer = res })
    },

    /**
     * @param   {string}    target - 明细or统计
     */
    toggleList(target) {
      // 有切换历史
      const history = this[`${target}History`]
      if (history) {
        return this.$router.push(history)
      }
      // 无切换历史
      const stuid = this.$route.params.id
      return this.$router
        .push(this.getOppositeUrl(target, stuid))
    },

    getOppositeUrl(target, id) {
      return `/algorithm/knowledge/${target}/${id}`
    },
  },

  beforeRouteLeave(to, from, next) {
    const urlArr = from.path.split('/')
    const source = urlArr[urlArr.length - 2]
    const record = this[`${source}Record`]
    record(from.fullPath)
    next()
  },
}
