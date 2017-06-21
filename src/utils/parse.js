/**
 * Vue url参数解析插件
 * @author lmh
 * @name Parse
 * @class
 * @description 用来把一个query对象解析成合法的、符合后端接口要求的url参数字符串
 * @version 2017-06-21
 */

export default class Parse {
  static install(Vue) {
    /* eslint-disable no-param-reassign */

    /*
      传入的query定义在组件本地的data中，为如下这样的格式：
      query: {
        order: {
          role_number: 'asc',
        },
        like: {
          display_name: 'abc',
        },
        between: {
          created_at: [2017-03-02, 2017-03-04],
        },
      },
    */

    /**
     * query解析方法
     * @param {Object} query - 参数对象
     * @param {Object} query.order - 排序参数
     * @param {Object} query.like - 模糊搜索参数
     * @param {Array} query.between - 时间段搜索参数
     */
    Vue.prototype.$parse = (query) => {
      const queries = Object.entries(query)

      const parsedQueries = queries.reduce((result, [prop, subQuery]) => {
        if (typeof subQuery !== 'object') {
          return `${result}${prop}=${subQuery}&`
        }

        const subQueries = Object.entries(subQuery)
        const parsedSubQueries = subQueries.reduce((subResult, [key, value]) => {
          // 处理between情况
          if (Array.isArray(value)) {
            return `${subResult}${prop}[${key}][]=${value[0]}&${prop}[${key}][]=${value[0]}&`
          }
          // 处理其它一般情况
          return value ? `${subResult}${prop}[${key}]=${value}&` : subResult
        }, '')

        return `${result}${parsedSubQueries}`
      }, '')

      const result = parsedQueries.replace(/&+$/, '')
      return result ? `?${result}` : ''
    }
  }
}
