/**
 * 实现Vue1.x $broadcast/dispatch事件广播方法
 * @author  chenliangshan
 * @version 2017/10/09
 */

/**
  * @param {String} componentName - 目标组件的name属性
  * @param {String} eventName - 广播事件名称
  * @param {Array} params - 广播事件参数
  */
function broadcast(componentName, eventName, ...params) {
  this.$children.forEach((child) => {
    if (child.$options.name === componentName) {
      child.$emit(eventName, ...params)
    } else {
      broadcast.call(child, componentName, eventName, ...params)
    }
  })
}

/**
 * 向下查找组件
 * @param context
 * @param componentName
 * @return {Object}
 */
function findComponentDownward(context, componentName) {
  const childrens = context.$children
  let children = null

  if (childrens.length) {
    // eslint-disable-next-line
    for (const child of childrens) {
      const name = child.$options.name
      if (name === componentName) {
        children = child
        break
      } else {
        children = findComponentDownward(child, componentName)
        if (children) break
      }
    }
  }
  return children
}

/**
 * 向下查找组件
 * @param context
 * @param componentName
 * @return {Array}
 */
function findComponentsDownward(context, componentName) {
  return context.$children.reduce((components, child) => {
    if (child.$options.name === componentName) components.push(child)
    const foundChilds = findComponentsDownward(child, componentName)
    return components.concat(foundChilds)
  }, [])
}

export default {
  methods: {
    // 事件广播
    broadcast(...args) {
      broadcast.call(this, ...args)
    },

    dispatch(componentName, eventName, params) {
      let parent = this.$parent || this.$root
      let name = parent.$options.name

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent

        if (parent) {
          name = parent.$options.name
        }
      }
      if (parent) {
        // eslint-disable-next-line
        parent.$emit.apply(parent, [eventName].concat(params))
      }
    },

    // 向下查找组件(单个)
    findComponentDownward(...args) {
      return findComponentDownward.call(this, ...args)
    },

    // 向下查找组件(多个)
    findComponentsDownward(...args) {
      return findComponentsDownward.call(this, ...args)
    },
  },
}
