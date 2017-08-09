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
      query: {
        order: {},
        like: {},
      },
    }
  },

  methods: {
    subStringify(type, subQuery) {
      return Object.entries(subQuery).reduce((result, [key, value]) => {
        if (type === 'between') {
          if (value.length <= 0) return result

          const betweenQs = value
            .filter(item => item)
            .map(item => `${type}[${key}][]=${format(item, 'YYYY-MM-DD')}`)
            .join('&')
          return `${result}${betweenQs}&`
        } else if (value) {
          return `${result}${type}[${key}]=${value}&`
        }
        return result
      }, '')
    },

    // 将query对象解析为合法的url参数字符串
    stringify(query) {
      const queryString = Object
        .entries(query)
        .reduce((result, [type, subQuery]) => {
          // $route.query中的值
          if (typeof subQuery !== 'object') {
            // 碰到between字段时，必须把type字符串最后的[0]/[1]去掉
            return `${result}${type.replace(/\[\d\]$/, '')}=${subQuery}&`
          } else if (type.includes('between[')) {
            // $route中的值有点奇葩，between有的情况下会是一个数组
            return `${result}${type}=${subQuery[0]}&${type}=${subQuery[1]}&`
          }
          return `${result}${this.subStringify(type, subQuery)}`
        }, '')
        .replace(/^&+/, '')
        .replace(/&+$/, '')

      return queryString ? `?${queryString}` : ''
    },

    // 把url参数字符串解析为query对象
    parse(str) {
      return str
        .split('&')
        /* eslint-disable no-param-reassign */
        .reduce((result, item) => {
          const matches = item.match(/(\w+)\[(\w+)\](\[\])?=(.*)/)

          if (matches) {
            const [, type, key, isArray, value] = matches
            if (!result[type]) result[type] = {}
            if (isArray) {
              if (!result[type][key]) result[type][key] = []
              result[type][key].push(value)
            } else {
              result[type][key] = +value || value
            }
          }

          return result
        }, {})
    },

    // 更改每页条数
    pageSizeChange(per_page) {
      this.query = { ...this.query, per_page, page: 1 }
      this.updateData()
    },

    // 跳页
    goTo(page) {
      // 因为like的值直接绑定在query对象上，导致用户即使没有按下“搜索”按钮，跳页时，已经输入的关键字也会被带入url参数里
      // 比较好的解决办法是把like移除query对象，只在“搜索”时才手动并入query
      // 但由于这需要改动所有调用了此mixin的方法，为了不做破坏性改动，这里用了一种稍微不是那么好的解决方式
      // 跳页时不再使用query对象，而是直接从地址栏拿search串，改变其中的page参数即可
      let { search } = location
      if (search.includes('page')) {
        search = search.replace(/([^_]page=)\d+/, `$1${page}`)
      } else if (search) {
        search += `&page=${page}`
      } else {
        search += `?page=${page}`
      }
      this.updateData(search)
    },

    // 排序
    sort({ key, order }) {
      this.query = {
        ...this.query,
        order: { [key]: order },
      }
      this.updateData()
    },

    // 点击搜索按钮
    search() {
      // 每次搜索，应该重新回到第一页
      this.query = { ...this.query, page: 1 }
      this.updateData()
    },

    // 根据改变后query重新获取列表
    updateData(queryString = this.stringify(this.query)) {
      // 更新路由，路由地址的参数应与请求接口的参数同步
      const { path } = this.$route
      this.$router.push(`${path}${queryString}`)

      // 获取数据
      this.fetchData(queryString)
    },

    fetchData(queryString) {
      if (this.getData) {
        this.getData(queryString)
          .catch(() => {
            this.$Notice.error({ title: '无法访问数据，请稍后再试', duration: 0 })
          })
          .then(() => {
            this.$store.commit(GLOBAL.LOADING.HIDE)
          })
      }
    },
  },

  watch: {
    // 每次改变模糊搜索的字段后，模糊搜索的值清空
    likeKey() {
      this.query = {
        ...this.query,
        like: {},
      }
    },
  },

  created() {
    const queryString = this.stringify(this.$route.query)

    // 把url参数解析回对象，以便表单的值正确地显示
    const parsed = this.parse(queryString)
    if (parsed.like) {
      const likeKeys = Object.keys(parsed.like)
      if (likeKeys.length) this.likeKey = likeKeys[0]
    }

    // 改变likeKeys后，对应watch方法会把query中的like清空
    // 因此必须在watch方法调用后再给query赋值
    // 由于watch是异步的，这里使用setTimeout来保证执行顺序
    setTimeout(() => {
      this.query = { ...this.query, ...parsed }
    })


    this.updateData(queryString)
  },

  beforeRouteUpdate(to, from, next) {
    const queryString = this.stringify(to.query)
    this.fetchData(queryString)
    next()
  },
}
