/**
 * 实现Vue1.x $broadcast事件广播方法
 * @author  chenliangshan
 * @version 2017/8/1
 */
/*eslint-disable*/
const broadcast = function(componentName, eventName, params) {
  this.$children.forEach((child) => {
    const that = child
    const name = child.$options.name
    if (name === componentName) {
      child.$emit.apply(that, [eventName].concat(params))
    } else {
      broadcast.apply(that, [componentName, eventName].concat([params]))
    }
  })
}

export default broadcast
