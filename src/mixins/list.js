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

          // 日期范围无值时不处理
          if (value === null || (typeof value === 'object' && (value.length === 0 || !value[0]))) {
            // 清空路由日期字段值
            return { ...result, [key]: [] }
          }

          // 处理值为日期的情况
          if (value.toISOString) {
            return { ...result, [key]: format(value, 'YYYY-MM-DD') }
          }

          // 处理between查询的值
          if (typeof value === 'object') {
            const [startDate, endDate] = value
            const start = format(startDate, 'YYYY-MM-DD')
            const end = format(endDate, 'YYYY-MM-DD')
            return { ...result, [key]: [start, end] }
          }

          return { ...result, [key]: value || '' }
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
          if (typeof value === 'object' && value.length > 0) {
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

      // $route.query的值都为字符串，这里把可以转为数字类型的值转为数字类型
      Object.keys(copy).forEach((key) => {
        const value = copy[key]
        if (typeof value === 'string' && value) {
          const numberifiedValue = +value
          // 判断转换结果是否为NaN
          // eslint-disable-next-line
          if (numberifiedValue === numberifiedValue) {
            copy[key] = numberifiedValue
          }
        }
      })

      delete copy.page
      delete copy.per_page
      const likeKey = this.getLikeKey(copy)
      if (likeKey) {
        // 这里拿到的likeKey实际上是'like[display_name]'这样的形式，这里需要的是中括号中的部分
        this.likeKey = likeKey.replace(/like\[(.+)\]/, '$1')

        // 因为组件对likeKey做了监听，每次更改likeKey时会清空likeValue，所以这里使用$nextTick来避免这一次的复制被清空
        const likeValue = copy[likeKey]
        delete copy[likeKey]
        this.$nextTick(() => {
          this.likeValue = likeValue
        })
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
      const copy = {}
      Object.keys(this.$route.query).forEach((item) => {
        // 过滤上一次排序条件
        if (!/order\[\w+]/.test(item)) {
          copy[item] = this.$route.query[item]
        }
      })
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
          _timestamp: Date.now(), // 处理可重复请求
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

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.mapRouteToQuery()
      vm.fetchData(to)
    })
  },

  beforeRouteUpdate(to, from, next) {
    this.fetchData(to)
    next()
  },
}
