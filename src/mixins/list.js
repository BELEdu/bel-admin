/**
 * 列表页公共逻辑
 * @author lmh
 * @version 2017-06-20
 */

export default {
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
      this.filter()
    },

    // 更改每页条数
    pageSizeChange(per_page) {
      this.query = { ...this.query, per_page, page: 1 }
      this.getData(this.qs)
    },

    // 跳页
    goTo(page) {
      this.query = { ...this.query, page }
      this.getData(this.qs)
    },

    // 获取排序、过滤后的列表
    filter() {
      const { path } = this.$router.currentRoute
      this.$router.push(`${path}${this.qs}`)
      this.getData(this.qs)
    },
  },

  created() {
    this.getData(location.search)
  },
}
