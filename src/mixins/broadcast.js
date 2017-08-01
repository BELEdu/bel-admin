/**
 * 实现Vue1.x $broadcast事件广播方法
 * @author  chenliangshan
 * @version 2017/08/01
 */

/**
  * @param {String} componentName - 目标组件的name属性
  、@param {String} eventName - 广播事件名称
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

export default {
  methods: {
    // 事件广播
    broadcast(...args) {
      broadcast.call(this, ...args)
    },
  },
}
