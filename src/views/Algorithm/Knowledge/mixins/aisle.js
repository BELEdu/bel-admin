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
        .then((res) => {
          if (res.data.length && res.data[0].created_at) {
            res.data.forEach((item) => {
              // eslint-disable-next-line
              item.created_at = item.created_at.slice(0, 10)
            })
          }
          this.buffer = res
        })
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
      const { id, typeID } = this.$route.params
      return this.$router
        .push(this.getOppositeUrl(target, id, typeID))
    },

    getOppositeUrl(target, id, typeID) {
      return `/algorithm/knowledge/${target}/${id}/${typeID}`
    },
  },

  beforeRouteLeave(to, from, next) {
    const urlArr = from.path.split('/')
    const source = urlArr[urlArr.length - 3]
    const record = this[`${source}Record`]
    record(from.fullPath)
    next()
  },
}
