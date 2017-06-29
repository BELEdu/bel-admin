/**
 * 列表页公共逻辑
 * @author lmh
 * @version 2017-06-20
 */

export default {
  data() {
    return {
      query: {
        ...this.$route.query,
        order: {},
        like: {},
        between: [],
      },
    }
  },
  computed: {
    qs() {
      return this.$parse(this.query)
    },
  },

  methods: {
    // 排序
    sort({ key, order }) {
      this.query = {
        ...this.query,
        order: {
          [key]: order,
        },
      }
    },

    // 更改每页条数
    pageSizeChange(per_page) {
      this.query = { ...this.query, per_page, page: 1 }
    },

    // 跳页
    goTo(page) {
      this.query = { ...this.query, page }
    },

    // 获取排序、过滤后的列表
    filter() {
      this.updatePath()
      this.getData(this.qs)
    },
    // 更新当前路由
    updatePath() {
      const { path } = this.$router.currentRoute
      this.$router.push(`${path}${this.qs}`)
    },
  },

  created() {
    this.filter()
  },
  watch: {
    qs() {
      this.filter()
    },
  },
}
