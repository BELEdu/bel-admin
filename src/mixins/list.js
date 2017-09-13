/**
 * 列表页公共逻辑
 * @author lmh
 * @version 2017-07-06
 */

/**
 * 约定
 * 1. 搜索表单的数据必须绑定在一个叫`query`的对象中，`query`定义在各自的组件内
 * 2. 模糊搜索的下拉框绑定`likeKey`字段，文本框绑定`query.like[likeKey]`，`likeKey`定义在各自的组件内
 * 3. 在表格上设置`@on-sort-change="sort"`
 * 4. 获取列表数据的方法必须命名为`getData`，方法将接受到`qs`参数，方法内只需把此参数拼接到接口上做请求（记得return这个请求）
 * 5. 翻页组件上设置`@on-change="goTo"`和`@on-page-size-change="pageSizeChange"`
 * 6. 搜索表格的提交按钮上设置`@click="search"`
 */

import { GLOBAL } from '@/store/mutationTypes'
import format from 'date-fns/format'

export default {
  data() {
    return {
      query: {},
      likeValue: '',
    }
  },

  computed: {
    routeQuery() {
      return Object.keys(this.query)
        .reduce((result, key) => {
          const value = this.query[key]

          // 无值时不处理
          if (value == null || value.length === 0) {
            return result
          }

          // 处理between查询的值
          if (typeof value === 'object') {
            const [startDate, endDate] = value
            const start = format(startDate, 'YYYY-MM-DD')
            const end = format(endDate, 'YYYY-MM-DD')
            return { ...result, [key]: [start, end] }
          }

          return { ...result, [key]: value }
        }, {})
    },
  },

  watch: {
    likeKey() {
      this.likeValue = ''
    },
  },

  methods: {
    parse(query) {
      return Object.keys(query)
        .reduce((result, key) => {
          const value = query[key]

          // between查询必须做特殊处理
          if (typeof value === 'object') {
            const [start, end] = value
            return `${result}&${key}[]=${start}&${key}[]=${end}`
          }

          return `${result}&${key}=${value}`
        }, '')
        .replace(/^&/, '?')
    },

    // 刷新页面时，根据$route.query设置this.query的值，以便视图上正确反应当前的搜索条件
    mapRouteToQuery() {
      const copy = { ...this.$route.query }
      delete copy.page
      delete copy.per_page
      const likeKey = this.getLikeKey(copy)
      if (likeKey) {
        this.likeValue = copy[likeKey]
        delete copy[likeKey]
      }
      this.query = {
        ...this.query,
        ...copy,
      }
    },

    getLikeKey(query) {
      return Object.keys(query).find(key => key.includes('like['))
    },

    push(query, isSearch) {
      const copy = { ...this.$route.query }

      // 如果是搜索按钮触发的，需要处理like查询
      if (isSearch) {
        // 清理已经存在的like查询
        const likeKey = this.getLikeKey(copy)
        if (likeKey) {
          delete copy[likeKey]
        }
        // 如果当前likeValue有值，插入新的like查询
        if (this.likeValue) {
          copy[`like[${this.likeKey}]`] = this.likeValue
        }
      }

      this.$router.push({
        query: {
          ...copy,
          ...query,
        },
      })
    },

    // 更改每页条数
    pageSizeChange(per_page) {
      this.push({
        per_page,
        page: 1,
      })
    },

    // 跳页
    goTo(page) {
      this.push({ page })
    },

    // 排序
    sort({ key, order }) {
      this.push({
        [`order[${key}]`]: order,
      })
    },

    // 每次搜索，应该重新回到第一页
    search() {
      this.push({
        ...this.routeQuery,
        page: 1,
      }, true)
    },

    fetchData(to = this.$route) {
      if (this.getData) {
        this.getData(this.parse(to.query), to)
          .catch(() => {
            this.$Notice.error({ title: '无法访问数据，请稍后再试', duration: 0 })
          })
          .then(() => {
            this.$store.commit(GLOBAL.LOADING.HIDE)
          })
      }
    },
  },

  created() {
    this.mapRouteToQuery()
    this.fetchData()
  },

  beforeRouteUpdate(to, from, next) {
    this.fetchData(to)
    next()
  },
}
