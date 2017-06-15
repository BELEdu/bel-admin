/**
 * Vue url参数解析插件
 * @author lmh
 * @name Parse
 * @class
 * @description 用来把一个query对象解析成合法的、符合后端接口要求的url参数字符串
 * @version 2017-06-14
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
      },
    */

    /**
     * query解析方法
     * @param {Object} query - 参数对象
     * @param {Object} query.order - 排序参数对象
     * @param {Object} query.like - 模糊搜索参数对象
     * @description 由于产品在某些交互细节上还未确定，目前此方法只考虑order和like这两种排序
     */
    Vue.prototype.$parse = (query) => {
      const queries = Object.entries(query)

      const parsedQueries = queries.reduce((result, [prop, subQuery]) => {
        if (typeof subQuery !== 'object') {
          return `${result}${prop}=${subQuery}&`
        }

        const subQueries = Object.entries(subQuery)
        const parsedSubQueries = subQueries.reduce((subResult, [key, value]) => (
          value ? `${subResult}${prop}[${key}]=${value}&` : subResult
        ), '')
        return `${result}${parsedSubQueries}&`
      }, '')

      const result = parsedQueries.replace(/&+$/, '')
      return result ? `?${result}` : ''
    }
  }
}
